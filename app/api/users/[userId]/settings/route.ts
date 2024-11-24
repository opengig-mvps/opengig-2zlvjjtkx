import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type SettingsRequestBody = {
  enableReminders: boolean;
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

    const body: SettingsRequestBody = await request.json();
    const { enableReminders } = body;

    await prisma.userSettings.update({
      where: { userId },
      data: { enableReminders },
    });

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully!',
      data: { enableReminders },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}