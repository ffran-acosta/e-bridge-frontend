'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/shared';
import { usePerformanceMonitor, useFunctionTimer } from '../hooks/usePerformanceMonitor';

interface PerformanceDebuggerProps {
    enabled?: boolean;
    componentName?: string;
}

// Componente para debuggear el rendimiento en desarrollo
// Solo se muestra cuando NODE_ENV === 'development'
export const PerformanceDebugger: React.FC<PerformanceDebuggerProps> = ({ 
    enabled = true, 
    componentName = 'Unknown' 
}) => {
    const [showMetrics, setShowMetrics] = useState(false);
    const { getMetrics, resetMetrics, renderCount } = usePerformanceMonitor(componentName, enabled);
    const { timeFunction } = useFunctionTimer();

    // No mostrar en producción
    if (process.env.NODE_ENV !== 'development' || !enabled) {
        return null;
    }

    const metrics = getMetrics();

    const handleResetMetrics = () => {
        timeFunction(() => {
            resetMetrics();
            setShowMetrics(false);
        }, 'Reset Performance Metrics');
    };

    return (
        <Card className="fixed bottom-4 right-4 w-80 z-50 border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                    <span>🔍 Performance Monitor</span>
                    <Badge variant="outline" className="text-xs">
                        {componentName}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span>Renders:</span>
                        <Badge variant={renderCount > 10 ? "destructive" : "secondary"}>
                            {renderCount}
                        </Badge>
                    </div>
                    
                    {showMetrics && (
                        <>
                            <div className="flex items-center justify-between text-xs">
                                <span>Avg Render Time:</span>
                                <span className={metrics.averageRenderTime > 16 ? "text-red-600" : "text-green-600"}>
                                    {metrics.averageRenderTime.toFixed(2)}ms
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs">
                                <span>Last Render:</span>
                                <span className={metrics.lastRenderTime > 16 ? "text-red-600" : "text-green-600"}>
                                    {metrics.lastRenderTime.toFixed(2)}ms
                                </span>
                            </div>
                        </>
                    )}
                    
                    <div className="flex gap-1 pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowMetrics(!showMetrics)}
                            className="text-xs h-6 px-2"
                        >
                            {showMetrics ? 'Hide' : 'Show'} Details
                        </Button>
                        
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResetMetrics}
                            className="text-xs h-6 px-2"
                        >
                            Reset
                        </Button>
                    </div>
                    
                    {renderCount > 20 && (
                        <div className="text-xs text-red-600 font-medium">
                            ⚠️ High render count detected!
                        </div>
                    )}
                    
                    {metrics.averageRenderTime > 16 && (
                        <div className="text-xs text-orange-600 font-medium">
                            ⚠️ Slow renders detected!
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

// HOC para agregar monitoreo de rendimiento a cualquier componente
export function withPerformanceMonitor<P extends object>(
    Component: React.ComponentType<P>,
    componentName?: string
) {
    const WrappedComponent = (props: P) => {
        const name = componentName || Component.displayName || Component.name || 'Unknown';
        
        return (
            <>
                <Component {...props} />
                <PerformanceDebugger componentName={name} />
            </>
        );
    };

    WrappedComponent.displayName = `withPerformanceMonitor(${componentName || Component.displayName || Component.name})`;
    
    return WrappedComponent;
}
