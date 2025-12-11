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

    const { label, priority, deadline } = body;

    if (!label.trim()) {
        return new Response('Le Label est requis !!!!!', { status: 400 });
    }

    let deadlineIso: string | null = null;
    if (deadline) {
        const date = new Date(deadline);
        if (!isNaN(date.getTime())) {
            deadlineIso = date.toISOString();
        }
    }

    const todo = await prisma.todo.create({
        data: {
            label,
            priority: priority || 'LOW',
            deadline: deadlineIso,
            isDeleted: false,
        },
    });
    return Response.json({ data: todo });
}
