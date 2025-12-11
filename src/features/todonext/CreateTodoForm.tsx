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
import { Plus } from 'lucide-react';
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
        },
        onError: (error) => {
            toast('Ça marche pas', {
                description: <p className="text-red-600">{error.message}</p>,
                duration: Infinity,
                action: {
                    label: 'Réduire',
                    onClick: () => console.log(''),
                },
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
            className="flex gap-4 mb-6 justify-center"
        >
            <Field>
                <Input
                    type="text"
                    className="w-full"
                    {...register('label', {
                        minLength: {
                            value: 3,
                            message:
                                'Votre message doit faire plus de 3 caractères',
                        },
                    })}
                />
                {errors.label && (
                    <p className="text-red-600">{errors.label.message}</p>
                )}
            </Field>

            <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Priorité" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="LOW">Basse</SelectItem>
                            <SelectItem value="MEDIUM">Moyenne</SelectItem>
                            <SelectItem value="HIGH">Haute</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            />

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
                                    className="w-40 justify-between border-gray-200"
                                >
                                    {date
                                        ? date.toLocaleDateString()
                                        : 'Deadline'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(date) => {
                                        field.onChange(date?.toISOString());
                                        setOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    );
                }}
            />

            <Button
                type="submit"
                variant="outline"
                size="icon"
                className="border-transparent"
                disabled={createMutation.isPending}
            >
                {createMutation.isPending ? (
                    <Spinner />
                ) : (
                    <Plus className="size-5 text-green-600" />
                )}
            </Button>
        </form>
    );
};
