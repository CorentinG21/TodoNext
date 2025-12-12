'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { toast } from 'sonner';

export const PageSignUp = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (jsp: React.FormEvent) => {
        jsp.preventDefault();
        setLoading(true);

        await authClient.signUp.email(
            { email, password, name, callbackURL: '/sign-in' },
            {
                onRequest: () => setLoading(true),
                onSuccess: () => {
                    toast('Ça marche !!!!', {
                        description: (
                            <p className="text-green-600">
                                Votre compte a été créé avec succès. Vous pouvez
                                maintenant vous connecter.
                            </p>
                        ),
                        duration: 5000,
                        action: {
                            label: 'OK',
                            onClick: () => console.log('Toast fermé'),
                        },
                    });
                    router.push('/sign-in');
                },
                onError: (ctx) => {
                    toast('Ça marche pas', {
                        description: (
                            <p className="text-red-600">{ctx.error.message}</p>
                        ),
                        duration: Infinity,
                        action: {
                            label: 'Réduire',
                            onClick: () => console.log('Toast réduit'),
                        },
                    });
                    setLoading(false);
                },
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-gray-800">
                        Créer un compte
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(creation) =>
                                    setName(creation.target.value)
                                }
                                placeholder="Votre nom"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(creation) =>
                                    setEmail(creation.target.value)
                                }
                                placeholder="email@example.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(creation) =>
                                    setPassword(creation.target.value)
                                }
                                placeholder="********"
                                required
                                disabled={loading}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Spinner className="h-4 w-4" />
                            ) : (
                                'S’inscrire'
                            )}
                        </Button>

                        <p className="text-center text-sm text-gray-600 mt-2">
                            Déjà un compte ?{' '}
                            <Link
                                href="/sign-in"
                                className="text-blue-500 hover:underline font-medium"
                            >
                                Se connecter
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
