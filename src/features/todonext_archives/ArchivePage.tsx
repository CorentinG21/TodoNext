'use client';

import { Spinner } from '@/components/ui/spinner';
import { TodoItem } from '@/features/todonext/TodoItem';
import { Todo } from '@/generated/prisma/client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export const ArchivePage = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['deletedTodos'],
        queryFn: async () => {
            const result = await fetch('/api/archive');
            if (!result.ok) throw new Error('Cannot get todos');
            const json = await result.json();
            return json.data.filter((todo: Todo) => todo.isDeleted);
        },
    });

    const deletedTodos: Todo[] = data || [];

    return (
        <div className="min-h-screen from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10 md:mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                        Todos supprimés
                    </h1>
                    {!isLoading && !error && (
                        <p className="text-gray-500 text-lg">
                            {deletedTodos.length} tâche
                            {deletedTodos.length > 1 ? 's' : ''} supprimée
                            {deletedTodos.length > 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {isLoading && (
                    <div>
                        <Spinner />
                        Chargement des todos supprimés...
                    </div>
                )}

                {!isLoading && error && (
                    <div>Impossible de charger les todos supprimés.</div>
                )}

                {!isLoading && !error && (
                    <div className="space-y-4">
                        {deletedTodos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={() => {}}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                    >
                        Retour à la TodoList
                    </Link>
                </div>
            </div>
        </div>
    );
};
