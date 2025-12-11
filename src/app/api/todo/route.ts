import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET() {
    const todos = await prisma.todo.findMany({
        orderBy: [{ status: 'desc' }, { createdAt: 'asc' }],
    });
    return Response.json({ data: todos });
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { label } = body;

    if (!label.trim()) {
        return new Response('Le Label est requis !!!!!', { status: 400 });
    }

    const todo = await prisma.todo.create({
        data: {
            label,
        },
    });
    return Response.json({ data: todo });
}
