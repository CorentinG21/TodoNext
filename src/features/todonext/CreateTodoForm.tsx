'use client';

import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { useMutation } from '@tanstack/react-query';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import { useState } from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

type CreateTodoFormValues = {
    label: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    deadline?: string;
};

export const CreateTodoForm = () => {
    const createMutation = useMutation({
        mutationFn: async ({
            label,
            priority,
            deadline,
        }: CreateTodoFormValues) => {
            const res = await fetch('/api/todo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ label, priority, deadline }),
            });
            if (!res.ok) throw new Error('Erreur lors de la création');
            return res.json();
        },
        onSuccess: (_data, _vars, _onMutate, ctx) => {
            ctx.client.invalidateQueries({ queryKey: ['todos'] });
            toast('Tâche créée !', {
                description: (
                    <p className="text-green-600">
                        Votre nouvelle tâche a été ajoutée.
                    </p>
                ),
                duration: 2000,
            });
        },
        onError: (error) => {
            toast('Ça marche pas', {
                description: <p className="text-red-600">{error.message}</p>,
                duration: 3000,
            });
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<CreateTodoFormValues>({
        defaultValues: {
            priority: 'LOW',
        },
    });

    const onSubmit = (data: CreateTodoFormValues) => {
        createMutation.mutate(data);
        reset();
    };

    const [open, setOpen] = useState(false);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gradient-to-r from-gray-50/80 to-white rounded-lg shadow-sm border border-gray-200"
        >
            <div className="flex-1">
                <Field>
                    <Input
                        type="text"
                        placeholder="Ajouter une nouvelle tâche..."
                        className="w-full border-gray-300 focus:border-green-500 transition-colors"
                        {...register('label', {
                            required: 'Ce champ est requis',
                            minLength: {
                                value: 3,
                                message: 'Minimum 3 caractères',
                            },
                        })}
                    />
                    {errors.label && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.label.message}
                        </p>
                    )}
                </Field>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 items-start">
                <div className="w-[140px]">
                    <Controller
                        name="priority"
                        control={control}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <SelectTrigger className="w-full border-gray-300 hover:border-gray-400 transition-colors">
                                    <SelectValue placeholder="Priorité" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        value="LOW"
                                        className="text-green-600"
                                    >
                                        Basse
                                    </SelectItem>
                                    <SelectItem
                                        value="MEDIUM"
                                        className="text-amber-600"
                                    >
                                        Moyenne
                                    </SelectItem>
                                    <SelectItem
                                        value="HIGH"
                                        className="text-red-600"
                                    >
                                        Haute
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div className="w-[160px]">
                    <Controller
                        name="deadline"
                        control={control}
                        render={({ field }) => {
                            const date = field.value
                                ? new Date(field.value)
                                : undefined;
                            return (
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between border-gray-300 hover:border-gray-400 transition-colors"
                                        >
                                            {date ? (
                                                <span className="font-medium">
                                                    {date.toLocaleDateString(
                                                        'fr-FR',
                                                        {
                                                            day: 'numeric',
                                                            month: 'short',
                                                        }
                                                    )}
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <CalendarIcon className="size-4 text-gray-500" />
                                                    <span>Deadline</span>
                                                </span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(date) => {
                                                field.onChange(
                                                    date?.toISOString()
                                                );
                                                setOpen(false);
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            );
                        }}
                    />
                </div>

                <Button
                    type="submit"
                    size="icon"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-sm hover:shadow transition-all"
                    disabled={createMutation.isPending}
                >
                    {createMutation.isPending ? (
                        <Spinner className="size-5" />
                    ) : (
                        <Plus className="size-5" />
                    )}
                </Button>
            </div>
        </form>
    );
};
