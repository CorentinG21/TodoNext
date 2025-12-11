'use client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { Toaster } from './components/ui/sonner';

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
            <Toaster />
        </>
    );
};
