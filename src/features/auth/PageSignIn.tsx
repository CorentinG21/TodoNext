'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';

export const PageSignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (jsp: React.FormEvent) => {
        jsp.preventDefault();
        setLoading(true);

        await authClient.signIn.email(
            { email, password, callbackURL: '/' },
            {
                onRequest: () => setLoading(true),
                onSuccess: () => {
                    toast('Connexion réussie', {
                        description: (
                            <p className="text-green-600">
                                Vous êtes connecté !
                            </p>
                        ),
                        duration: 3000,
                    });
                    router.push('/');
                },
                onError: (ctx) => {
                    toast('Erreur de connexion', {
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
                        Connexion
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignIn} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(connexion) =>
                                    setEmail(connexion.target.value)
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
                                onChange={(connexion) =>
                                    setPassword(connexion.target.value)
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
                                'Se connecter'
                            )}
                        </Button>

                        <p className="text-center text-sm text-gray-600 mt-2">
                            Pas encore de compte ?{' '}
                            <Link
                                href="/sign-up"
                                className="text-blue-500 hover:underline font-medium"
                            >
                                S’inscrire
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
