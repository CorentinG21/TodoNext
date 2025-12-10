import { prisma } from '@/lib/prisma';
import { TodoItem } from '@/features/todonext/TodoItem';

export const HomePage = async () => {
  const todos = await prisma.todo.findMany();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 md:mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            TodoLIST
          </h1>
          <p className="text-gray-500 text-lg">
            {todos.length} tâche{todos.length > 1 ? 's' : ''} en cours
          </p>
        </div>

        <div className="space-y-4">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      </div>
    </div>
  );
};
