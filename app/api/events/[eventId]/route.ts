import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const eventId = parseInt(params.eventId, 10);
    if (isNaN(eventId)) {
      return NextResponse.json({ success: false, message: 'Invalid event ID' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        date: true,
        name: true,
        time: true,
        category: true,
        location: true,
        createdAt: true,
        updatedAt: true,
        description: true,
      },
    });

    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Event details fetched successfully!',
      data: event,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching event details:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}