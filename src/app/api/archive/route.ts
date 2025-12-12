import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
        return new Response('Pas Autorisé !!!!!', { status: 401 });
    }

    const todos = await prisma.todo.findMany({
        where: {
            isDeleted: true,
            userId: session.user.id,
        },
        orderBy: [{ status: 'desc' }, { createdAt: 'asc' }],
    });
    return Response.json({ data: todos });
}
