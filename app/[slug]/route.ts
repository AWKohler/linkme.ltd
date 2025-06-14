import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { qrcodes, scanEvents } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cacheHelpers } from '@/lib/redis';

interface IPInfoResponse {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  org?: string;
  timezone?: string;
  loc?: string;
}

function getClientIP(request: NextRequest): string {
  // Check various headers for the real client IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Check CF-Connecting-IP for Cloudflare
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) {
    return cfIP;
  }

  // Fallback to unknown if no IP can be determined
  return 'unknown';
}

async function getGeolocation(ip: string): Promise<IPInfoResponse | null> {
  if (!process.env.IPINFO_TOKEN) {
    console.warn('IPINFO_TOKEN not configured, skipping geolocation');
    return null;
  }

  // Check Redis cache first
  const cachedData = await cacheHelpers.getIPInfo(ip);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(`https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_TOKEN}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`IPInfo API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: IPInfoResponse = await response.json();
    
    // Cache the result for future requests
    await cacheHelpers.setIPInfo(ip, data);
    
    return data;
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Check Redis cache for QR redirect first
    const cachedTargetUrl = await cacheHelpers.getQRRedirect(slug);
    
    let qrCodeRecord;
    let targetUrl;
    
    if (cachedTargetUrl) {
      // Use cached target URL
      targetUrl = cachedTargetUrl;
      
      // Still need to get QR record for tracking (could optimize this further)
      const qrCode = await db
        .select()
        .from(qrcodes)
        .where(eq(qrcodes.slug, slug))
        .limit(1);
        
      if (qrCode.length === 0) {
        // Cache might be stale, remove it
        await cacheHelpers.removeQR(slug);
        return NextResponse.json(
          { error: 'QR code not found' }, 
          { status: 404 }
        );
      }
      
      qrCodeRecord = qrCode[0];
    } else {
      // Cache miss - query database
      const qrCode = await db
        .select()
        .from(qrcodes)
        .where(eq(qrcodes.slug, slug))
        .limit(1);

      // Return 404 if QR code not found
      if (qrCode.length === 0) {
        return NextResponse.json(
          { error: 'QR code not found' }, 
          { status: 404 }
        );
      }

      qrCodeRecord = qrCode[0];
      targetUrl = qrCodeRecord.targetUrl;
      
      // Cache the target URL for future requests
      await cacheHelpers.setQRRedirect(slug, targetUrl);
    }

    // Track scan event if tracking is enabled
    if (qrCodeRecord.enableTracking) {
      const clientIP = getClientIP(request);
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
      // Get geolocation data
      const geoData = await getGeolocation(clientIP);
      
      try {
        // Insert scan event
        await db.insert(scanEvents).values({
          qrCodeId: qrCodeRecord.id,
          ip: clientIP,
          city: geoData?.city || null,
          region: geoData?.region || null,
          country: geoData?.country || null,
          userAgent: userAgent,
        });
      } catch (error) {
        // Log error but don't fail the redirect
        console.error('Error logging scan event:', error);
      }
    }

    // Always redirect to the target URL
    return NextResponse.redirect(targetUrl, { status: 302 });
    
  } catch (error) {
    console.error('Error processing QR code redirect:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}