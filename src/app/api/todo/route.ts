import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
        return new Response('Pas Autorisé', { status: 401 });
    }

    const todos = await prisma.todo.findMany({
        where: {
            userId: session.user.id,
            isDeleted: false,
        },
        orderBy: [{ status: 'desc' }, { createdAt: 'asc' }],
    });
    return Response.json({ data: todos });
}

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
        return new Response('Pas Autorisé', { status: 401 });
    }

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
            userId: session.user.id,
        },
    });
    return Response.json({ data: todo });
}
