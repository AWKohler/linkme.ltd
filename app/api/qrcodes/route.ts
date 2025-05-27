import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { qrcodes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { cacheHelpers } from '@/lib/redis';

// GET /api/qrcodes - Get all QR codes for the authenticated user
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userQRCodes = await db
      .select()
      .from(qrcodes)
      .where(eq(qrcodes.createdBy, userId))
      .orderBy(qrcodes.createdAt);

    return NextResponse.json(userQRCodes);
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/qrcodes - Create a new QR code
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug, targetUrl, designJson, enableTracking } = await request.json();

    if (!slug || !targetUrl || !designJson) {
      return NextResponse.json({ 
        error: 'Missing required fields: slug, targetUrl, designJson' 
      }, { status: 400 });
    }

    // Fast slug uniqueness check using Redis cache
    const slugExistsInCache = await cacheHelpers.slugExists(slug);
    
    if (slugExistsInCache) {
      return NextResponse.json({ 
        error: 'Slug already exists' 
      }, { status: 409 });
    }

    // Double-check in database for safety (handles race conditions)
    const existingQRCode = await db
      .select({ id: qrcodes.id })
      .from(qrcodes)
      .where(eq(qrcodes.slug, slug))
      .limit(1);

    if (existingQRCode.length > 0) {
      // Slug exists in DB but not in cache - update cache and reject
      await cacheHelpers.setQRRedirect(slug, 'exists');
      return NextResponse.json({ 
        error: 'Slug already exists' 
      }, { status: 409 });
    }

    // Create the QR code in database
    const newQRCode = await db
      .insert(qrcodes)
      .values({
        slug,
        targetUrl,
        designJson,
        enableTracking: enableTracking || false,
        createdBy: userId,
      })
      .returning();

    // Cache the new QR redirect for fast lookups
    await cacheHelpers.setQRRedirect(slug, targetUrl);

    return NextResponse.json(newQRCode[0], { status: 201 });
  } catch (error) {
    console.error('Error creating QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}