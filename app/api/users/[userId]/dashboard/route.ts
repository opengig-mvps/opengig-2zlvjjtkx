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

    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        registrations: {
          include: {
            event: true,
          },
        },
        events: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const registeredEvents = user.registrations.map((registration) => ({
      id: registration.event.id,
      date: registration.event.date.toISOString(),
      name: registration.event.name,
      time: registration.event.time,
      location: registration.event.location,
    }));

    const upcomingSchedules = user.events.map((event) => ({
      id: event.id,
      date: event.date.toISOString(),
      name: event.name,
      time: event.time,
      location: event.location,
    }));

    return NextResponse.json({
      success: true,
      message: 'User dashboard data fetched successfully!',
      data: {
        registeredEvents,
        upcomingSchedules,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user dashboard data:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}