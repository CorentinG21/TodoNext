import 'dotenv/config'
import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker"

const todosToCreate = Array.from(Array(10)).map(() => ({
    label: faker.lorem.sentence(),
    priority: faker.helpers.arrayElement(['HIGH', 'LOW', 'MEDIUM']),
    status: faker.helpers.arrayElement(['CHECKED', 'NOT_CHECKED'])
}))

try {
    const createdTodo = await prisma.todo.createMany({
        data: todosToCreate,
    });
    console.log('✅Todos created', createdTodo)
} catch (error) {
    console.log('❌Error', error)
}