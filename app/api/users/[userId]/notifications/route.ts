import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            date: true,
            name: true,
            location: true,
          },
        },
      },
    });

    const notificationData = notifications.map((notification) => ({
      id: notification.id,
      event: {
        date: notification.event.date.toISOString(),
        name: notification.event.name,
        location: notification.event.location,
      },
      sentAt: notification.sentAt ? notification.sentAt.toISOString() : null,
      eventId: notification.eventId,
      notificationType: notification.notificationType,
    }));

    return NextResponse.json({
      success: true,
      message: 'Notifications fetched successfully!',
      data: notificationData,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}