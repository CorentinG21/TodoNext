import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type CreateTodoFormValues = {
    label: string;
};

export const CreateTodoForm = () => {
    const createMutation = useMutation({
        mutationFn: async ({ label }: { label: string }) => {
            const res = await fetch('/api/todo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ label }),
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
    } = useForm<CreateTodoFormValues>();

    const onSubmit = (data: CreateTodoFormValues) => {
        createMutation.mutate({ label: data.label });
        reset();
    };

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
                        // required: 'Le champ est requis',
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
            <Button type="submit" variant="outline" size="icon">
                +
            </Button>
        </form>
    );
};
