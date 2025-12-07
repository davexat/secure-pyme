"use client";

import { SecurityStatus, AlertLevel, AgentConnectionStatus } from "@/types";
import { Badge } from "@/components/ui/Badge/Badge";
import { Shield, AlertTriangle, XCircle, Wifi, WifiOff, Loader2 } from "lucide-react";
import styles from "./StatusBadge.module.css";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: SecurityStatus | AlertLevel | AgentConnectionStatus;
    type: "security" | "alert" | "connection";
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
    if (type === "security") {
        const securityConfig: Record<string, { className: string, icon: any }> = {
            "Seguro": { className: styles.securitySeguro, icon: Shield },
            "Advertencia": { className: styles.securityAdvertencia, icon: AlertTriangle },
            "Amenaza": { className: styles.securityAmenaza, icon: XCircle },
            "Desconectado": { className: styles.securityDesconectado, icon: WifiOff }
        };

        const config = securityConfig[status as string] || { className: "", icon: WifiOff };
        const Icon = config.icon;

        return (
            <Badge className={config.className}>
                <Icon className={styles.icon} />
                {status}
            </Badge>
        );
    }

    if (type === "alert") {
        const alertConfig: Record<string, { className: string }> = {
            "Baja": { className: styles.alertBaja },
            "Media": { className: styles.alertMedia },
            "Alta": { className: styles.alertAlta }
        };

        const config = alertConfig[status as string] || { className: "" };

        return (
            <Badge className={config.className}>
                {status}
            </Badge>
        );
    }

    if (type === "connection") {
        const connectionConfig: Record<string, { className: string, icon: any }> = {
            "Conectado": { className: styles.connectionConectado, icon: Wifi },
            "Desconectado": { className: styles.securityDesconectado, icon: WifiOff },
            "En sincronización": { className: cn(styles.connectionSincronizacion, styles.spin), icon: Loader2 }
        };

        const config = connectionConfig[status as string] || { className: "", icon: WifiOff };
        const Icon = config.icon;

        return (
            <Badge className={config.className}>
                <Icon className={styles.icon} />
                {status}
            </Badge>
        );
    }

    return null;
}
