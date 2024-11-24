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

    const feedbacks = await prisma.feedback.findMany({
      where: { eventId },
      select: {
        id: true,
        rating: true,
        userId: true,
        eventId: true,
        comments: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback fetched successfully!',
      data: feedbacks,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}