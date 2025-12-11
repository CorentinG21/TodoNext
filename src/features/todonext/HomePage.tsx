'use client';

import { Spinner } from '@/components/ui/spinner';
import { TodoItem } from '@/features/todonext/TodoItem';
import { Todo } from '@/generated/prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';

export const HomePage = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['todos'],
        queryFn: async () => {
            const result = await fetch('/api/todo');
            if (!result.ok) throw new Error('Cannot get todos');
            return (await result.json()) as { data: Array<Todo> };
        },
    });

    const toggleMutation = useMutation({
        mutationFn: async ({
            id,
            checked,
        }: {
            id: string;
            checked: boolean;
        }) => {
            await fetch(`/api/todo/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: checked ? 'CHECKED' : 'NOT_CHECKED',
                }),
            });
        },
        onSuccess: () => {
            refetch();
        },
    });

    // const createMutation = useMutation({
    //     mutationFn: async ({newLabel} : { newLabel: string}) => {
    //         await fetch('/api/todo', {
    //             method: 'POST',
    //             headers : { 'Contant-Type' : 'application/json'},
    //             body: JSON.stringify({ label: newLabel })
    //         })
    //     },
    //     onSuccess: () => {
    //         refetch();
    //     }
    // })

    const todos = data?.data || [];

    const nbNotChecked = todos.filter(
        (todo) => todo.status === 'NOT_CHECKED'
    ).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10 md:mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                        TodoLIST
                    </h1>
                    {!isLoading && !error && (
                        <p className="text-gray-500 text-lg">
                            {nbNotChecked} tâche{nbNotChecked > 1 ? 's' : ''} en
                            cours
                        </p>
                    )}
                </div>

                {isLoading && (
                    <div>
                        <Spinner />
                        Loading todos...
                    </div>
                )}

                {!isLoading && error && <div>Cannot load todos.</div>}

                {!isLoading && !error && (
                    <div className="space-y-4">
                        {todos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={(checked) =>
                                    toggleMutation.mutate({
                                        id: todo.id,
                                        checked,
                                    })
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
