'use client';

import { Spinner } from '@/components/ui/spinner';
import { TodoItem } from '@/features/todonext/TodoItem';
import { Todo } from '@/generated/prisma/client';
import { CreateTodoForm } from './CreateTodoForm';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export const HomePage = () => {
    const { data: session } = authClient.useSession();

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

    const router = useRouter();

    const handleLogout = async () => {
        try {
            await authClient.signOut();
            toast('Déconnecté', {
                description: 'Vous avez été déconnecté avec succès.',
                duration: 2000,
            });
            router.push('/sign-in');
        } catch (err) {
            console.log(err);
        }
    };

    const todos = data?.data || [];
    const user = session?.user;

    const nbNotChecked = todos.filter(
        (todo) => todo.status === 'NOT_CHECKED'
    ).length;

    return (
        <div className="min-h-screen from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10 md:mb-12">
                    <div className="flex items-center justify-between mb-3">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                            TodoLIST
                        </h1>
                        {user && (
                            <p className="text-gray-700 font-medium">
                                Bonjour,{' '}
                                <span className="font-bold">{user.name}</span>
                            </p>
                        )}

                        <Button
                            size="icon"
                            className="bg-transparent hover:bg-red-300"
                            onClick={handleLogout}
                        >
                            <LogOut className="text-red-600 size-6" />
                        </Button>
                    </div>

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
                    <>
                        <CreateTodoForm />
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
                    </>
                )}

                <div className="mt-8 text-center">
                    <Link
                        href="/app/archive"
                        className="inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                    >
                        Voir les archives
                    </Link>
                </div>
            </div>
        </div>
    );
};
