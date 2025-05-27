'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';
import { MapPin, TrendingUp, Smartphone, Globe } from 'lucide-react';
import WorldMap from '@/components/WorldMap';

interface QRCode {
  id: string;
  slug: string;
  targetUrl: string;
  enableTracking: boolean;
}

interface DeviceAnalytics {
  android: number;
  ios: number;
  other: number;
}

interface LocationItem {
  name: string;
  count: number;
  country?: string;
  region?: string;
}

interface LocationAnalytics {
  countries: LocationItem[];
  regions: LocationItem[];
  cities: LocationItem[];
}

interface MapDataPoint {
  country: string;
  city: string;
  region: string;
  count: number;
  coordinates?: [number, number];
}

interface ScanAnalytics {
  totalScans: number;
  deviceBreakdown: DeviceAnalytics;
  locationBreakdown: LocationAnalytics;
  mapData: MapDataPoint[];
}

const DEVICE_COLORS = {
  android: '#34D399',
  ios: '#60A5FA', 
  other: '#F59E0B'
};

export default function AnalyticsPage() {
  const { user } = useUser();
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [selectedQRCodes, setSelectedQRCodes] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<ScanAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch user's QR codes
  useEffect(() => {
    const fetchQRCodes = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/qrcodes');
        if (response.ok) {
          const data = await response.json();
          // Only show QR codes that have tracking enabled
          const trackingEnabledQRCodes = data.filter((qr: QRCode) => qr.enableTracking);
          setQrCodes(trackingEnabledQRCodes);
          
          // Auto-select all tracking-enabled QR codes initially
          const allIds = trackingEnabledQRCodes.map((qr: QRCode) => qr.id);
          setSelectedQRCodes(allIds);
        }
      } catch (error) {
        console.error('Error fetching QR codes:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchQRCodes();
  }, [user]);

  // Fetch analytics when selection changes
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (selectedQRCodes.length === 0) {
        setAnalytics(null);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            qrCodeIds: selectedQRCodes
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!initialLoading) {
      fetchAnalytics();
    }
  }, [selectedQRCodes, initialLoading]);

  const handleQRCodeToggle = (qrCodeId: string) => {
    setSelectedQRCodes(prev => 
      prev.includes(qrCodeId)
        ? prev.filter(id => id !== qrCodeId)
        : [...prev, qrCodeId]
    );
  };

  const selectAll = () => {
    setSelectedQRCodes(qrCodes.map(qr => qr.id));
  };

  const deselectAll = () => {
    setSelectedQRCodes([]);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (initialLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Prepare device data for pie chart
  const deviceChartData = analytics ? [
    { name: 'Android', value: analytics.deviceBreakdown.android, color: DEVICE_COLORS.android },
    { name: 'iOS', value: analytics.deviceBreakdown.ios, color: DEVICE_COLORS.ios },
    { name: 'Other', value: analytics.deviceBreakdown.other, color: DEVICE_COLORS.other },
  ].filter(item => item.value > 0) : [];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
      </div>

      {qrCodes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">No trackable QR codes found</h3>
              <p className="text-gray-600 mb-4">
                Create QR codes with tracking enabled to see analytics here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* QR Code Selector */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Select QR Codes to Analyze
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Button variant="outline" onClick={selectAll} size="sm">
                  Select All
                </Button>
                <Button variant="outline" onClick={deselectAll} size="sm">
                  Deselect All
                </Button>
                <span className="text-sm text-gray-600 self-center">
                  {selectedQRCodes.length} of {qrCodes.length} selected
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {qrCodes.map((qrCode) => (
                  <div key={qrCode.id} className="flex items-center space-x-2 p-3 border rounded">
                    <Checkbox
                      id={qrCode.id}
                      checked={selectedQRCodes.includes(qrCode.id)}
                      onCheckedChange={() => handleQRCodeToggle(qrCode.id)}
                    />
                    <Label htmlFor={qrCode.id} className="cursor-pointer flex-1">
                      <div className="font-medium">{qrCode.slug}</div>
                      <div className="text-sm text-gray-600 truncate">
                        {qrCode.targetUrl}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading analytics...</p>
            </div>
          )}

          {analytics && !loading && (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalScans.toLocaleString()}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Countries</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.locationBreakdown.countries.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cities</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.locationBreakdown.cities.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mobile Scans</CardTitle>
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {((analytics.deviceBreakdown.android + analytics.deviceBreakdown.ios) / analytics.totalScans * 100).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* World Map */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Scan Locations Worldwide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WorldMap data={analytics.mapData} />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Device Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Device Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={deviceChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                        >
                          {deviceChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Top Countries */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Countries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.locationBreakdown.countries.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Location Breakdowns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Top Cities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Cities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {analytics.locationBreakdown.cities.slice(0, 20).map((city, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border-b last:border-b-0">
                          <div>
                            <div className="font-medium">{city.name}</div>
                            <div className="text-sm text-gray-600">
                              {city.region}, {city.country}
                            </div>
                          </div>
                          <div className="font-bold">{city.count}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Regions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Regions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {analytics.locationBreakdown.regions.slice(0, 20).map((region, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border-b last:border-b-0">
                          <div>
                            <div className="font-medium">{region.name}</div>
                            <div className="text-sm text-gray-600">{region.country}</div>
                          </div>
                          <div className="font-bold">{region.count}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Countries List */}
                <Card>
                  <CardHeader>
                    <CardTitle>All Countries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {analytics.locationBreakdown.countries.map((country, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border-b last:border-b-0">
                          <div className="font-medium">{country.name}</div>
                          <div className="font-bold">{country.count}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {selectedQRCodes.length === 0 && !loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">No QR codes selected</h3>
                  <p className="text-gray-600">
                    Select one or more QR codes above to view their analytics.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}