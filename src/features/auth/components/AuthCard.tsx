"use client"

import { Card } from "@/shared";

export function AuthCard({ children, title }: { children: React.ReactNode; title: string }) {
    return (
        <div className="w-full min-h-[calc(100vh-4rem)] grid place-items-center p-4">
            <Card className="w-full max-w-md p-6 space-y-4">
                <h1 className="text-2xl font-semibold">{title}</h1>
                {children}
            </Card>
        </div>
    );
}
