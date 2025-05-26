import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { qrcodes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

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

    await db
      .delete(qrcodes)
      .where(and(
        eq(qrcodes.id, id),
        eq(qrcodes.createdBy, userId)
      ));

    return NextResponse.json({ message: 'QR code deleted successfully' });
  } catch (error) {
    console.error('Error deleting QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}