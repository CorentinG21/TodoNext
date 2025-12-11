import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';

type CreateTodoFormValues = {
    onCreate: (label: string) => void;
};

export const CreateTodoForm = ({ onCreate }: CreateTodoFormValues) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<{ label: string }>();

    const onSubmit = (data: { label: string }) => {
        onCreate(data.label);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 mb-6">
            <Field>
                <Input
                    type="text"
                    className="w-full"
                    {...register('label', {
                        required: 'Le champ est requis',
                        minLength: {
                            value: 3,
                            message:
                                'Votre message doit faire plus de 3 caractéres',
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
