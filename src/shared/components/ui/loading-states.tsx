'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from './skeleton';

// Tipos de loading states
type LoadingSize = 'sm' | 'md' | 'lg';
interface LoadingSpinnerProps {
    size?: LoadingSize;
    message?: string;
    className?: string;
}

interface LoadingSkeletonProps {
    lines?: number;
    className?: string;
}

interface InlineLoadingProps {
    message?: string;
    size?: LoadingSize;
}

// Componente de spinner centralizado
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    message = 'Cargando...',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return (
        <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
            <div className="text-center">
                <Loader2 className={`${sizeClasses[size]} animate-spin mx-auto mb-4 text-primary`} />
                <p className="text-muted-foreground">{message}</p>
            </div>
        </div>
    );
};

// Componente de skeleton para listas
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    lines = 3,
    className = ''
}) => {
    return (
        <div className={`space-y-4 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
                <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    );
};

// Componente de skeleton para cards
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            ))}
        </div>
    );
};

// Componente de skeleton para tablas
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
    rows = 5, 
    columns = 4 
}) => {
    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/50 p-3">
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                    {Array.from({ length: columns }).map((_, index) => (
                        <Skeleton key={index} className="h-4 w-20" />
                    ))}
                </div>
            </div>
            <div className="divide-y">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="p-3">
                        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <Skeleton key={colIndex} className="h-4 w-full" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Componente de loading inline
export const InlineLoading: React.FC<InlineLoadingProps> = ({
    message = 'Cargando...',
    size = 'sm'
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
    };

    return (
        <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className={`${sizeClasses[size]} animate-spin`} />
            <span className="text-sm">{message}</span>
        </div>
    );
};

// Componente de loading con overlay
export const LoadingOverlay: React.FC<{ 
    isLoading: boolean; 
    children: React.ReactNode;
    message?: string;
}> = ({ isLoading, children, message = 'Cargando...' }) => {
    return (
        <div className="relative">
            {children}
            {isLoading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <LoadingSpinner message={message} size="md" />
                </div>
            )}
        </div>
    );
};

// Hook para manejar estados de loading complejos
export const useLoadingState = () => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const startLoading = React.useCallback(() => {
        setLoading(true);
        setError(null);
    }, []);

    const stopLoading = React.useCallback(() => {
        setLoading(false);
    }, []);

    const setErrorState = React.useCallback((errorMessage: string) => {
        setError(errorMessage);
        setLoading(false);
    }, []);

    const reset = React.useCallback(() => {
        setLoading(false);
        setError(null);
    }, []);

    return {
        loading,
        error,
        startLoading,
        stopLoading,
        setErrorState,
        reset
    };
};
