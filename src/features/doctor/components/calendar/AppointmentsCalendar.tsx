'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/shared';
import { DailyAppointmentsView } from './DailyAppointmentsView';
import { WeeklyAppointmentsView } from './WeeklyAppointmentsView';
import { MonthlyAppointmentsView } from './MonthlyAppointmentsView';
import { useDailyAppointments } from '../../hooks/useDailyAppointments';
import { useWeeklyAppointments } from '../../hooks/useWeeklyAppointments';
import { useMonthlyAppointments } from '../../hooks/useMonthlyAppointments';

type CalendarView = 'daily' | 'weekly' | 'monthly';

interface AppointmentsCalendarProps {
    className?: string;
}

export const AppointmentsCalendar = ({ className }: AppointmentsCalendarProps) => {
    const [currentView, setCurrentView] = useState<CalendarView>('daily');
    
    const dailyData = useDailyAppointments();
    const weeklyData = useWeeklyAppointments();
    const monthlyData = useMonthlyAppointments();

    const navigateToPatient = (patientId: string) => {
        if (patientId && patientId.trim() !== '') {
            const url = `/doctor/patients/${patientId}`;
            window.location.href = url;
        }
    };

    const handleViewChange = (view: CalendarView) => {
        setCurrentView(view);
        // Cuando cambiamos de vista, cargamos los datos para la fecha actual
        if (view === 'daily') {
            dailyData.setCurrentDate(new Date());
        } else if (view === 'weekly') {
            weeklyData.setCurrentDate(new Date());
        } else {
            monthlyData.setCurrentDate(new Date());
        }
    };

    const handleNavigateToDailyView = (date: Date) => {
        setCurrentView('daily');
        dailyData.setCurrentDate(date);
    };

    const renderCurrentView = () => {
        if (currentView === 'daily') {
            return (
                <DailyAppointmentsView
                    appointments={dailyData.appointments}
                    currentDate={dailyData.currentDate}
                    loading={dailyData.loading}
                    error={dailyData.error}
                    onDateChange={dailyData.setCurrentDate}
                    onNavigateToPatient={navigateToPatient}
                    onRefresh={dailyData.refetch}
                />
            );
        } else if (currentView === 'weekly') {
            return (
                <WeeklyAppointmentsView
                    appointments={weeklyData.appointments}
                    currentDate={weeklyData.currentDate}
                    loading={weeklyData.loading}
                    error={weeklyData.error}
                    onDateChange={weeklyData.setCurrentDate}
                    onNavigateToPatient={navigateToPatient}
                    onRefresh={weeklyData.refetch}
                />
            );
        } else {
            return (
                <MonthlyAppointmentsView
                    appointments={monthlyData.appointments}
                    currentDate={monthlyData.currentDate}
                    loading={monthlyData.loading}
                    error={monthlyData.error}
                    onDateChange={monthlyData.setCurrentDate}
                    onNavigateToDailyView={handleNavigateToDailyView}
                    onRefresh={monthlyData.refetch}
                />
            );
        }
    };

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">Calendario de Turnos</CardTitle>
                <div className="flex gap-1">
                    <Button
                        variant={currentView === 'daily' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleViewChange('daily')}
                    >
                        Día
                    </Button>
                    <Button
                        variant={currentView === 'weekly' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleViewChange('weekly')}
                    >
                        Semana
                    </Button>
                    <Button
                        variant={currentView === 'monthly' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleViewChange('monthly')}
                    >
                        Mes
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {renderCurrentView()}
            </CardContent>
        </Card>
    );
};