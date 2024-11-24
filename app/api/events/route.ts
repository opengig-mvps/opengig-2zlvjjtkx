import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const date = searchParams.get('date');
    const location = searchParams.get('location');
    const category = searchParams.get('category');
    const keyword = searchParams.get('keyword');

    const events = await prisma.event.findMany({
      where: {
        AND: [
          date ? { date: new Date(date) } : {},
          location ? { location: { contains: location, mode: 'insensitive' } } : {},
          category ? { category: { contains: category, mode: 'insensitive' } } : {},
          keyword ? {
            OR: [
              { name: { contains: keyword, mode: 'insensitive' } },
              { description: { contains: keyword, mode: 'insensitive' } },
            ],
          } : {},
        ],
      },
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

    return NextResponse.json({
      success: true,
      message: "Events fetched successfully!",
      data: events,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      data: error,
    }, { status: 500 });
  }
}