"use client";
import { useDashboardStore } from "../store/dashboard";

export function useDashboardStats() {
    const {
        stats,
        loading,
        error,
        fetchDashboard,
        clearError
    } = useDashboardStore();

    return {
        stats,
        loading,
        error,
        refetch: fetchDashboard,
        clearError
    };
}