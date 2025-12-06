"use client";

import { SecurityStatus, AlertLevel, AgentConnectionStatus } from "@/types";
import { Badge } from "@/components/ui/Badge/Badge";
import { Shield, AlertTriangle, XCircle, Wifi, WifiOff, Loader2 } from "lucide-react";

interface StatusBadgeProps {
    status: SecurityStatus | AlertLevel | AgentConnectionStatus;
    type: "security" | "alert" | "connection";
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
    if (type === "security") {
        const securityConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className?: string, icon: any }> = {
            "Seguro": { variant: "default", className: "bg-success text-success-foreground hover:bg-success/80", icon: Shield },
            "Advertencia": { variant: "default", className: "bg-warning text-warning-foreground hover:bg-warning/80", icon: AlertTriangle },
            "Amenaza": { variant: "destructive", icon: XCircle },
            "Desconectado": { variant: "secondary", icon: WifiOff }
        };

        // Default fallback if status doesn't match
        const config = securityConfig[status as string] || { variant: "outline", icon: WifiOff };
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className={config.className}>
                <Icon className="h-4 w-4 mr-1.5" />
                {status}
            </Badge>
        );
    }

    if (type === "alert") {
        const alertConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className?: string }> = {
            "Baja": { variant: "secondary" },
            "Media": { variant: "default", className: "bg-warning text-warning-foreground hover:bg-warning/80" },
            "Alta": { variant: "destructive" }
        };

        const config = alertConfig[status as string] || { variant: "outline" };

        return (
            <Badge variant={config.variant} className={config.className}>
                {status}
            </Badge>
        );
    }

    if (type === "connection") {
        const connectionConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className?: string, icon: any }> = {
            "Conectado": { variant: "default", className: "bg-success text-success-foreground hover:bg-success/80", icon: Wifi },
            "Desconectado": { variant: "secondary", icon: WifiOff },
            "En sincronización": { variant: "default", className: "bg-primary text-primary-foreground animate-pulse", icon: Loader2 }
        };

        // Default fallback
        const config = connectionConfig[status as string] || { variant: "outline", icon: WifiOff };
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className={config.className}>
                <Icon className="h-4 w-4 mr-1.5" />
                {status}
            </Badge>
        );
    }

    return null;
}
