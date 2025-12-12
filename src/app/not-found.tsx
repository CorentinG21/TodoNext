'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Prism from '@/components/Prism'; // Assure-toi que le chemin est correct

export default function NotFoundPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black p-4">
            <div className="absolute inset-0 z-0">
                <Prism
                    animationType="rotate"
                    timeScale={0.5}
                    height={3.5}
                    baseWidth={5.5}
                    scale={3.6}
                    hueShift={0.2}
                    colorFrequency={1}
                    noise={0.3}
                    glow={1.5}
                    suspendWhenOffscreen
                />
            </div>

            {/* Card centrée */}
            <Card className="w-full max-w-md text-center border-gray-200 shadow-sm rounded-xl relative z-10">
                <CardHeader>
                    <CardTitle className="text-4xl font-bold text-gray-800">
                        404
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-600">
                        Oups ! La page que vous cherchez n’existe pas.
                    </p>
                    <Link href="/">
                        <Button className="w-full">Retour à l’accueil</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
