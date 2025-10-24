"use client"

import { Card } from "@/shared";

export function AuthCard({ children, title }: { children: React.ReactNode; title: string }) {
    return (
        <div className="w-full min-h-[calc(100vh-4rem)] grid place-items-center p-4">
            <Card className="w-full max-w-md p-6 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                    <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                </div>
                {children}
            </Card>
        </div>
    );
}
