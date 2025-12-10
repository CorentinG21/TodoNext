import { prisma } from '@/lib/prisma';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const updated = await prisma.todo.update({
        where: { id },
        data: { status },
    });

    return Response.json({ data: updated });
}
