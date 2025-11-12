'use client';

import { lazy, Suspense } from 'react';
import type { WeeklyAppointmentsViewProps } from './WeeklyAppointmentsView';
import type { MonthlyAppointmentsViewProps } from './MonthlyAppointmentsView';
import type { DailyAppointmentsViewProps } from './DailyAppointmentsView';

// Componente de loading personalizado para las vistas de calendario
const CalendarViewLoading = () => (
    <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-muted-foreground">Cargando vista del calendario...</p>
        </div>
    </div>
);

// Lazy loading de las vistas de calendario
const LazyWeeklyAppointmentsView = lazy(() =>
    import('./WeeklyAppointmentsView').then((module) => ({
        default: module.WeeklyAppointmentsView,
    }))
);

const LazyMonthlyAppointmentsView = lazy(() =>
    import('./MonthlyAppointmentsView').then((module) => ({
        default: module.MonthlyAppointmentsView,
    }))
);

const LazyDailyAppointmentsView = lazy(() =>
    import('./DailyAppointmentsView').then((module) => ({
        default: module.DailyAppointmentsView,
    }))
);

// Wrapper components con Suspense
export const LazyWeeklyView = (props: WeeklyAppointmentsViewProps) => (
    <Suspense fallback={<CalendarViewLoading />}>
        <LazyWeeklyAppointmentsView {...props} />
    </Suspense>
);

LazyWeeklyView.displayName = 'LazyWeeklyView';

export const LazyMonthlyView = (props: MonthlyAppointmentsViewProps) => (
    <Suspense fallback={<CalendarViewLoading />}>
        <LazyMonthlyAppointmentsView {...props} />
    </Suspense>
);

LazyMonthlyView.displayName = 'LazyMonthlyView';

export const LazyDailyView = (props: DailyAppointmentsViewProps) => (
    <Suspense fallback={<CalendarViewLoading />}>
        <LazyDailyAppointmentsView {...props} />
    </Suspense>
);

LazyDailyView.displayName = 'LazyDailyView';
