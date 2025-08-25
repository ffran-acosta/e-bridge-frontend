import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    iconColor?: string;
}

export function StatsCard({ title, value, icon: Icon, iconColor = "text-primary" }: StatsCardProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold text-foreground">{value}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}