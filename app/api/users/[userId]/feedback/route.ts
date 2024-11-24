import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type FeedbackRequestBody = {
  rating: number;
  eventId: number;
  comments: string;
};

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const body: FeedbackRequestBody = await request.json();
    const { rating, eventId, comments } = body;

    if (!rating || !eventId || !comments) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const registration = await prisma.eventRegistration.findFirst({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });

    if (!registration) {
      return NextResponse.json({ success: false, message: 'User did not attend the event' }, { status: 403 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: userId,
        eventId: eventId,
        rating: rating,
        comments: comments,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully!',
      data: {
        id: feedback.id,
        rating: feedback.rating,
        userId: feedback.userId,
        eventId: feedback.eventId,
        comments: feedback.comments,
        createdAt: feedback.createdAt.toISOString(),
        updatedAt: feedback.updatedAt.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}