import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const currentTime = new Date();
    const twentyFourHoursLater = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);

    // Retrieve all upcoming events within 24 hours
    const upcomingEvents = await prisma.event.findMany({
      where: {
        date: {
          gte: currentTime,
          lte: twentyFourHoursLater,
        },
      },
      include: {
        user: true,
      },
    });

    // Filter users with reminder preferences enabled
    await Promise.all(
      upcomingEvents.map(async (event) => {
        const userSettings = await prisma.userSettings.findFirst({
          where: { userId: event.userId, enableReminders: true },
        });

        if (userSettings) {
          // Send notifications to users who have reminders enabled
          await sendEmail({
            to: event.user.email,
            template: {
              subject: `Reminder: Upcoming Event - ${event.name}`,
              html: `<h1>Don't forget your event: ${event.name}</h1>`,
              text: `Don't forget your event: ${event.name}`,
            },
          });

          // Log the notification in the database
          await prisma.notification.create({
            data: {
              userId: event.userId,
              eventId: event.id,
              notificationType: 'Event Reminder',
              sentAt: new Date(),
            },
          });
        }
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Reminders sent successfully!',
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error sending reminders:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}