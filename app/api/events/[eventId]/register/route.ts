import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email-service';

export async function POST(
  request: Request,
  { params }: { params: { eventId: string, userId: string } }
) {
  try {
    const eventId = parseInt(params.eventId, 10);
    const userId = parseInt(params.userId, 10);
    if (isNaN(eventId) || isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid event ID or user ID' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId, isVerified: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not authenticated or not verified' }, { status: 403 });
    }

    const event = await prisma.event.findFirst({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    const registrationId = `REG${Math.floor(100000 + Math.random() * 900000)}`;
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        userId,
        registrationId,
      },
    });

    await sendEmail({
      to: user.email,
      template: {
        subject: 'Event Registration Confirmation',
        html: `<h1>Registration Successful</h1><p>You have successfully registered for the event: ${event.name}</p>`,
        text: `Registration Successful. You have successfully registered for the event: ${event.name}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful! A confirmation email has been sent.',
      data: {
        userId: user.id,
        eventId: event.id,
        registrationId: registration.registrationId,
        registrationDate: registration.registrationDate.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error during event registration:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}