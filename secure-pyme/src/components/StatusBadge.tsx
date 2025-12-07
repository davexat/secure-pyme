"use client";

import { SecurityStatus, AlertLevel, AgentConnectionStatus } from "@/types";
import { Badge, BadgeProps } from "@/components/ui/Badge/Badge";
import { Shield, AlertTriangle, XCircle, Wifi, WifiOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: SecurityStatus | AlertLevel | AgentConnectionStatus;
    type: "security" | "alert" | "connection";
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
    if (type === "security") {
        const securityConfig: Record<string, { variant: BadgeProps['variant'], icon: any }> = {
            "Seguro": { variant: "success", icon: Shield },
            "Advertencia": { variant: "warning", icon: AlertTriangle },
            "Amenaza": { variant: "danger", icon: XCircle },
            "Desconectado": { variant: "secondary", icon: WifiOff }
        };

        const config = securityConfig[status as string] || { variant: "secondary", icon: WifiOff };
        const Icon = config.icon;

        return (
            <Badge variant={config.variant}>
                <Icon className="h-4 w-4" />
                {status}
            </Badge>
        );
    }

    if (type === "alert") {
        const alertConfig: Record<string, { variant: BadgeProps['variant'] }> = {
            "Baja": { variant: "success" },
            "Media": { variant: "warning" },
            "Alta": { variant: "danger" }
        };

        const config = alertConfig[status as string] || { variant: "default" };

        return (
            <Badge variant={config.variant}>
                {status}
            </Badge>
        );
    }

    if (type === "connection") {
        const connectionConfig: Record<string, { variant: BadgeProps['variant'], icon: any, iconClass?: string }> = {
            "Conectado": { variant: "success", icon: Wifi },
            "Desconectado": { variant: "secondary", icon: WifiOff },
            "En sincronización": { variant: "default", icon: Loader2, iconClass: "spin" }
        };

        const config = connectionConfig[status as string] || { variant: "secondary", icon: WifiOff };
        const Icon = config.icon;

        return (
            <Badge variant={config.variant}>
                <Icon className={cn("h-4 w-4", config.iconClass)} />
                {status}
            </Badge>
        );
    }

    return null;
}
