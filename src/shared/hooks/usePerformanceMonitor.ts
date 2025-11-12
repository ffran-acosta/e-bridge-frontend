'use client';

import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
    renderCount: number;
    lastRenderTime: number;
    averageRenderTime: number;
    componentName: string;
}

// Hook para monitorear el rendimiento de componentes
// Útil para detectar componentes que se re-renderizan demasiado
export function usePerformanceMonitor(componentName: string, enabled = true) {
    const renderCountRef = useRef(0);
    const renderTimesRef = useRef<number[]>([]);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        if (!enabled) return;

        renderCountRef.current += 1;
        startTimeRef.current = performance.now();

        return () => {
            const renderTime = performance.now() - startTimeRef.current;
            renderTimesRef.current.push(renderTime);

            // Mantener solo los últimos 10 renders para el promedio
            if (renderTimesRef.current.length > 10) {
                renderTimesRef.current = renderTimesRef.current.slice(-10);
            }

            // Log de rendimiento en desarrollo
            if (process.env.NODE_ENV === 'development') {
                const averageRenderTime = renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length;
                
                console.group(`🔍 Performance Monitor - ${componentName}`);
                console.log(`Render #${renderCountRef.current}`);
                console.log(`Current render time: ${renderTime.toFixed(2)}ms`);
                console.log(`Average render time: ${averageRenderTime.toFixed(2)}ms`);
                console.log(`Total renders: ${renderCountRef.current}`);
                
                // Warning si hay demasiados renders
                if (renderCountRef.current > 20) {
                    console.warn(`⚠️ Component ${componentName} has rendered ${renderCountRef.current} times! Consider optimization.`);
                }
                
                // Warning si el render es muy lento
                if (renderTime > 16) { // 60fps = 16ms per frame
                    console.warn(`⚠️ Slow render detected: ${renderTime.toFixed(2)}ms (target: <16ms for 60fps)`);
                }
                
                console.groupEnd();
            }
        };
    });

// Función para obtener métricas actuales
    const getMetrics = (): PerformanceMetrics => {
        const averageRenderTime = renderTimesRef.current.length > 0 
            ? renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length
            : 0;

        return {
            renderCount: renderCountRef.current,
            lastRenderTime: renderTimesRef.current[renderTimesRef.current.length - 1] || 0,
            averageRenderTime,
            componentName
        };
    };

// Función para resetear métricas
    const resetMetrics = () => {
        renderCountRef.current = 0;
        renderTimesRef.current = [];
    };

    return {
        getMetrics,
        resetMetrics,
        renderCount: renderCountRef.current
    };
}

// Hook para medir el tiempo de ejecución de funciones
export function useFunctionTimer() {
    const timeFunction = (fn: () => void, functionName: string) => {
        const start = performance.now();
        fn();
        const end = performance.now();
        
        if (process.env.NODE_ENV === 'development') {
            console.log(`⏱️ ${functionName} took ${(end - start).toFixed(2)}ms`);
        }
        
        return end - start;
    };

    const timeAsyncFunction = async (fn: () => Promise<void>, functionName: string) => {
        const start = performance.now();
        await fn();
        const end = performance.now();
        
        if (process.env.NODE_ENV === 'development') {
            console.log(`⏱️ ${functionName} took ${(end - start).toFixed(2)}ms`);
        }
        
        return end - start;
    };

    return {
        timeFunction,
        timeAsyncFunction
    };
}

// Hook para detectar memory leaks en componentes
export function useMemoryLeakDetector(componentName: string) {
    const listenersRef = useRef<(() => void)[]>([]);
    const timersRef = useRef<NodeJS.Timeout[]>([]);
    const intervalsRef = useRef<NodeJS.Timeout[]>([]);

    // Función para registrar listeners
    const addListener = (cleanup: () => void) => {
        listenersRef.current.push(cleanup);
    };

    // Función para registrar timers
    const addTimer = (timer: NodeJS.Timeout) => {
        timersRef.current.push(timer);
    };

    // Función para registrar intervals
    const addInterval = (interval: NodeJS.Timeout) => {
        intervalsRef.current.push(interval);
    };

    // Cleanup automático
    useEffect(() => {
        const listeners = listenersRef.current;
        const timers = timersRef.current;
        const intervals = intervalsRef.current;

        return () => {
            if (process.env.NODE_ENV === 'development') {
                console.group(`🧹 Memory Leak Detection - ${componentName}`);

                // Cleanup listeners
                listeners.forEach(cleanup => {
                    try {
                        cleanup();
                    } catch (error) {
                        console.warn('Error during listener cleanup:', error);
                    }
                });

                // Cleanup timers
                timers.forEach(timer => {
                    clearTimeout(timer);
                });

                // Cleanup intervals
                intervals.forEach(interval => {
                    clearInterval(interval);
                });

                console.log(`Cleaned up ${listeners.length} listeners, ${timers.length} timers, ${intervals.length} intervals`);
                console.groupEnd();
            }

            listenersRef.current = [];
            timersRef.current = [];
            intervalsRef.current = [];
        };
    }, [componentName]);

    return {
        addListener,
        addTimer,
        addInterval
    };
}
