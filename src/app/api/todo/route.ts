import { prisma } from '@/lib/prisma';

export async function GET() {
    const todos = await prisma.todo.findMany();
    return Response.json({ data: todos });
}
