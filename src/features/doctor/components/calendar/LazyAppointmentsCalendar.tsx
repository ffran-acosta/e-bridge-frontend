'use client';

import { lazy, Suspense } from 'react';

// Componente de loading personalizado para el calendario
const CalendarLoading = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando calendario de citas...</p>
        </div>
    </div>
);

// Lazy loading del AppointmentsCalendar
const LazyAppointmentsCalendarComponent = lazy(() => 
    import('./AppointmentsCalendar').then(module => ({ 
        default: module.AppointmentsCalendar 
    }))
);

export const LazyAppointmentsCalendar = () => {
    return (
        <Suspense fallback={<CalendarLoading />}>
            <LazyAppointmentsCalendarComponent />
        </Suspense>
    );
};
