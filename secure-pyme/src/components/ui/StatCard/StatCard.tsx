import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
    iconColor?: string;
    borderColor?: 'success' | 'warning' | 'danger' | 'primary';
    className?: string;
}

export function StatCard({
    title,
    value,
    description,
    icon,
    iconColor,
    borderColor,
    className
}: StatCardProps) {
    return (
        <Card className={cn(borderColor && `stat-card-border-${borderColor}`, className)}>
            <CardHeader className="stat-card-header">
                <CardTitle className="stat-card-title">{title}</CardTitle>
                <div className={cn("h-4 w-4", iconColor)}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="stat-card-value">{value}</div>
                <p className="stat-card-label">{description}</p>
            </CardContent>
        </Card>
    );
}
