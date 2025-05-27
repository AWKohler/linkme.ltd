import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { qrcodes, scanEvents } from '@/db/schema';
import { eq, and, inArray, sql, desc } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface DeviceAnalytics {
  android: number;
  ios: number;
  other: number;
}

interface LocationAnalytics {
  countries: Array<{ name: string; count: number; coordinates?: [number, number] }>;
  regions: Array<{ name: string; count: number; country: string }>;
  cities: Array<{ name: string; count: number; region: string; country: string }>;
}

interface ScanAnalytics {
  totalScans: number;
  deviceBreakdown: DeviceAnalytics;
  locationBreakdown: LocationAnalytics;
  mapData: Array<{
    country: string;
    city: string;
    region: string;
    count: number;
    coordinates?: [number, number];
  }>;
}

// Simple country coordinates mapping (this could be expanded)
const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  'US': [-95.7129, 37.0902],
  'CA': [-106.3468, 56.1304],
  'GB': [-3.4360, 55.3781],
  'DE': [10.4515, 51.1657],
  'FR': [2.2137, 46.2276],
  'JP': [138.2529, 36.2048],
  'AU': [133.7751, -25.2744],
  'BR': [-51.9253, -14.2350],
  'IN': [78.9629, 20.5937],
  'CN': [104.1954, 35.8617],
  'MX': [-102.5528, 23.6345],
  'IT': [12.5674, 41.8719],
  'ES': [-3.7492, 40.4637],
  'NL': [5.2913, 52.1326],
  'SE': [18.6435, 60.1282],
  'NO': [8.4689, 60.4720],
  'DK': [9.5018, 56.2639],
  'FI': [25.7482, 61.9241],
  'CH': [8.2275, 46.8182],
  'AT': [14.5501, 47.5162],
  'BE': [4.4699, 50.5039],
  'PL': [19.1343, 51.9194],
  'CZ': [15.4730, 49.8175],
  'SK': [19.6990, 48.6690],
  'HU': [19.5033, 47.1625],
  'RO': [24.9668, 45.9432],
  'BG': [25.4858, 42.7339],
  'GR': [21.8243, 39.0742],
  'PT': [-8.2245, 39.3999],
  'IE': [-8.2439, 53.4129],
  'IS': [-19.0208, 64.9631],
  'LU': [6.1296, 49.8153],
  'MT': [14.3754, 35.9375],
  'CY': [33.4299, 35.1264],
  'EE': [25.0136, 58.5953],
  'LV': [24.6032, 56.8796],
  'LT': [23.8813, 55.1694],
  'SI': [14.9955, 46.1512],
  'HR': [15.2, 45.1],
  'BA': [17.6791, 43.9159],
  'RS': [21.0059, 44.0165],
  'ME': [19.3744, 42.7087],
  'MK': [21.7453, 41.6086],
  'AL': [20.1683, 41.1533],
  'KR': [127.7669, 35.9078],
  'TH': [100.9925, 15.8700],
  'VN': [108.2772, 14.0583],
  'MY': [101.9758, 4.2105],
  'SG': [103.8198, 1.3521],
  'ID': [113.9213, -0.7893],
  'PH': [121.7740, 12.8797],
  'TW': [120.9605, 23.6978],
  'HK': [114.1694, 22.3193],
  'MO': [113.5439, 22.1987],
  'NZ': [174.8860, -40.9006],
  'AR': [-63.6167, -38.4161],
  'CL': [-71.5430, -35.6751],
  'PE': [-75.0152, -9.1900],
  'CO': [-74.2973, 4.5709],
  'VE': [-66.5897, 6.4238],
  'EC': [-78.1834, -1.8312],
  'BO': [-63.5887, -16.2902],
  'UY': [-55.7658, -32.5228],
  'PY': [-58.4438, -23.4425],
  'ZA': [22.9375, -30.5595],
  'EG': [30.8025, 26.8206],
  'MA': [-7.0926, 31.7917],
  'NG': [8.6753, 9.0820],
  'KE': [37.9062, -0.0236],
  'ET': [40.4897, 9.1450],
  'GH': [-1.0232, 7.9465],
  'TZ': [34.8888, -6.3690],
  'UG': [32.2903, 1.3733],
  'ZW': [29.1549, -19.0154],
  'ZM': [27.8546, -13.1339],
  'MW': [34.3015, -13.2543],
  'MZ': [35.5296, -18.6657],
  'BW': [24.6849, -22.3285],
  'NA': [18.4904, -22.9576],
  'SZ': [31.4659, -26.5225],
  'LS': [28.2336, -29.6100],
  'TR': [35.2433, 38.9637],
  'SA': [45.0792, 23.8859],
  'AE': [53.8478, 23.4241],
  'IL': [34.8516, 32.7940],
  'JO': [36.2384, 30.5852],
  'LB': [35.8623, 33.8547],
  'SY': [38.9968, 34.8021],
  'IQ': [43.6793, 33.2232],
  'IR': [53.6880, 32.4279],
  'AF': [67.7090, 33.9391],
  'PK': [69.3451, 30.3753],
  'BD': [90.3563, 23.6850],
  'LK': [80.7718, 7.8731],
  'MV': [73.2207, 3.2028],
  'NP': [84.1240, 28.3949],
  'BT': [90.4336, 27.5142],
  'MM': [95.9560, 21.9162],
  'KH': [104.9910, 12.5657],
  'LA': [102.4955, 19.8563],
  'MN': [103.8467, 46.8625],
  'KZ': [66.9237, 48.0196],
  'UZ': [64.5853, 41.3775],
  'TM': [59.5563, 38.9697],
  'TJ': [71.2761, 38.8610],
  'KG': [74.7661, 41.2044],
  'RU': [105.3188, 61.5240],
  'UA': [31.1656, 48.3794],
  'BY': [27.9534, 53.7098],
  'MD': [28.3699, 47.4116],
  'GE': [43.3569, 42.3154],
  'AM': [45.0382, 40.0691],
  'AZ': [47.5769, 40.1431],
};

function parseUserAgent(userAgent: string): 'android' | 'ios' | 'other' {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('android')) {
    return 'android';
  } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod') || ua.includes('ios')) {
    return 'ios';
  } else {
    return 'other';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { qrCodeIds } = await request.json();

    if (!qrCodeIds || !Array.isArray(qrCodeIds) || qrCodeIds.length === 0) {
      return NextResponse.json({ 
        error: 'Missing required field: qrCodeIds (array)' 
      }, { status: 400 });
    }

    // Verify that all QR codes belong to the user
    const userQRCodes = await db
      .select({ id: qrcodes.id })
      .from(qrcodes)
      .where(and(
        eq(qrcodes.createdBy, userId),
        inArray(qrcodes.id, qrCodeIds)
      ));

    const validQRCodeIds = userQRCodes.map(qr => qr.id);

    if (validQRCodeIds.length === 0) {
      return NextResponse.json({
        totalScans: 0,
        deviceBreakdown: { android: 0, ios: 0, other: 0 },
        locationBreakdown: { countries: [], regions: [], cities: [] },
        mapData: []
      });
    }

    // Get total scan count
    const totalScansResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(scanEvents)
      .where(inArray(scanEvents.qrCodeId, validQRCodeIds));

    const totalScans = totalScansResult[0]?.count || 0;

    // Get device breakdown
    const deviceData = await db
      .select({
        userAgent: scanEvents.userAgent,
        count: sql<number>`count(*)`
      })
      .from(scanEvents)
      .where(and(
        inArray(scanEvents.qrCodeId, validQRCodeIds),
        sql`${scanEvents.userAgent} IS NOT NULL AND ${scanEvents.userAgent} != ''`
      ))
      .groupBy(scanEvents.userAgent);

    const deviceBreakdown = deviceData.reduce(
      (acc, row) => {
        const deviceType = parseUserAgent(row.userAgent || '');
        acc[deviceType] += Number(row.count) || 0;
        return acc;
      },
      { android: 0, ios: 0, other: 0 }
    );

    // Get country breakdown
    const countryData = await db
      .select({
        country: scanEvents.country,
        count: sql<number>`count(*)`
      })
      .from(scanEvents)
      .where(and(
        inArray(scanEvents.qrCodeId, validQRCodeIds),
        sql`${scanEvents.country} IS NOT NULL`
      ))
      .groupBy(scanEvents.country)
      .orderBy(desc(sql`count(*)`))
      .limit(50);

    const countries = countryData.map(row => ({
      name: row.country || 'Unknown',
      count: row.count,
      coordinates: COUNTRY_COORDINATES[row.country || ''] as [number, number] | undefined
    }));

    // Get region breakdown
    const regionData = await db
      .select({
        region: scanEvents.region,
        country: scanEvents.country,
        count: sql<number>`count(*)`
      })
      .from(scanEvents)
      .where(and(
        inArray(scanEvents.qrCodeId, validQRCodeIds),
        sql`${scanEvents.region} IS NOT NULL`
      ))
      .groupBy(scanEvents.region, scanEvents.country)
      .orderBy(desc(sql`count(*)`))
      .limit(50);

    const regions = regionData.map(row => ({
      name: row.region || 'Unknown',
      count: row.count,
      country: row.country || 'Unknown'
    }));

    // Get city breakdown
    const cityData = await db
      .select({
        city: scanEvents.city,
        region: scanEvents.region,
        country: scanEvents.country,
        count: sql<number>`count(*)`
      })
      .from(scanEvents)
      .where(and(
        inArray(scanEvents.qrCodeId, validQRCodeIds),
        sql`${scanEvents.city} IS NOT NULL`
      ))
      .groupBy(scanEvents.city, scanEvents.region, scanEvents.country)
      .orderBy(desc(sql`count(*)`))
      .limit(50);

    const cities = cityData.map(row => ({
      name: row.city || 'Unknown',
      count: row.count,
      region: row.region || 'Unknown',
      country: row.country || 'Unknown'
    }));

    // Get map data (aggregated by location for performance)
    const mapData = cityData.map(row => ({
      country: row.country || 'Unknown',
      city: row.city || 'Unknown',
      region: row.region || 'Unknown',
      count: Number(row.count) || 0,
      coordinates: COUNTRY_COORDINATES[row.country || ''] as [number, number] | undefined
    }));

    const analytics: ScanAnalytics = {
      totalScans,
      deviceBreakdown,
      locationBreakdown: {
        countries,
        regions,
        cities
      },
      mapData
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}