import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type CreateTodoFormValues = {
    label: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
};

export const CreateTodoForm = () => {
    const createMutation = useMutation({
        mutationFn: async ({ label, priority }: CreateTodoFormValues) => {
            const res = await fetch('/api/todo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ label, priority }),
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
        setValue,
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

            <Button type="submit" variant="outline" size="icon">
                +
            </Button>
        </form>
    );
};
