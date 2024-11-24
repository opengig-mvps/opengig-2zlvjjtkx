import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { userId: string, eventId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    const eventId = parseInt(params.eventId, 10);

    if (isNaN(userId) || isNaN(eventId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID or event ID' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const event = await prisma.event.findFirst({
      where: { id: eventId, userId: userId },
    });

    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Event added to calendar successfully!',
      data: null,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error adding event to calendar:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}