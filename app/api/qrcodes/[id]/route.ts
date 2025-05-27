import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { qrcodes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { cacheHelpers } from '@/lib/redis';

// GET /api/qrcodes/[id] - Get a specific QR code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const qrCode = await db
      .select()
      .from(qrcodes)
      .where(and(
        eq(qrcodes.id, id),
        eq(qrcodes.createdBy, userId)
      ))
      .limit(1);

    if (qrCode.length === 0) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    return NextResponse.json(qrCode[0]);
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/qrcodes/[id] - Update a specific QR code
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { slug, targetUrl, designJson, enableTracking } = await request.json();

    if (!slug || !targetUrl || !designJson) {
      return NextResponse.json({ 
        error: 'Missing required fields: slug, targetUrl, designJson' 
      }, { status: 400 });
    }

    // First check if the QR code exists and belongs to the user
    const existingQRCode = await db
      .select()
      .from(qrcodes)
      .where(and(
        eq(qrcodes.id, id),
        eq(qrcodes.createdBy, userId)
      ))
      .limit(1);

    if (existingQRCode.length === 0) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    const oldSlug = existingQRCode[0].slug;
    const oldTargetUrl = existingQRCode[0].targetUrl;
    
    // If slug changed, check uniqueness first
    if (slug !== oldSlug) {
      const slugExistsInCache = await cacheHelpers.slugExists(slug);
      
      if (slugExistsInCache) {
        return NextResponse.json({ 
          error: 'Slug already exists' 
        }, { status: 409 });
      }

      // Double-check in database
      const conflictingQRCode = await db
        .select({ id: qrcodes.id })
        .from(qrcodes)
        .where(eq(qrcodes.slug, slug))
        .limit(1);

      if (conflictingQRCode.length > 0) {
        await cacheHelpers.setQRRedirect(slug, 'exists');
        return NextResponse.json({ 
          error: 'Slug already exists' 
        }, { status: 409 });
      }
    }

    const updatedQRCode = await db
      .update(qrcodes)
      .set({
        slug,
        targetUrl,
        designJson,
        enableTracking: enableTracking || false,
      })
      .where(and(
        eq(qrcodes.id, id),
        eq(qrcodes.createdBy, userId)
      ))
      .returning();

    // Update cache: remove old slug and set new one
    if (slug !== oldSlug) {
      await cacheHelpers.removeQR(oldSlug);
    }
    await cacheHelpers.setQRRedirect(slug, targetUrl);

    return NextResponse.json(updatedQRCode[0]);
  } catch (error) {
    console.error('Error updating QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/qrcodes/[id] - Delete a specific QR code
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // First check if the QR code exists and belongs to the user
    const existingQRCode = await db
      .select()
      .from(qrcodes)
      .where(and(
        eq(qrcodes.id, id),
        eq(qrcodes.createdBy, userId)
      ))
      .limit(1);

    if (existingQRCode.length === 0) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    const slugToRemove = existingQRCode[0].slug;

    await db
      .delete(qrcodes)
      .where(and(
        eq(qrcodes.id, id),
        eq(qrcodes.createdBy, userId)
      ));

    // Remove from cache
    await cacheHelpers.removeQR(slugToRemove);

    return NextResponse.json({ message: 'QR code deleted successfully' });
  } catch (error) {
    console.error('Error deleting QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}