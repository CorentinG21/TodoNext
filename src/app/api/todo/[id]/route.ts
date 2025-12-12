import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({ headers: req.headers });

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!session) {
        return new Response('Pas Autorisé !!!!!', { status: 401 });
    }

    const updated = await prisma.todo.update({
        where: {
            id,
            userId: session.user.id,
        },
        data: { status },
    });

    return Response.json({ data: updated });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({
        headers: req.headers,
    });

    if (!session) {
        return new Response('Pas Autorisé !!!!!', { status: 401 });
    }

    const { id } = await params;
    const deleted = await prisma.todo.update({
        where: {
            id,
            userId: session.user.id,
        },
        data: { isDeleted: true },
    });
    return Response.json({ data: deleted });
}
