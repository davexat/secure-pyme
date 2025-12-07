"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { mockAlerts } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/Button/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard/StatCard";

import { Alert } from "@/types";
import styles from "./page.module.css";
import { cn } from "@/lib/utils";

export default function Alertas() {
    const [alertas, setAlertas] = useState<Alert[]>(mockAlerts);
    const [alertaSeleccionada, setAlertaSeleccionada] = useState<Alert | null>(null);
    const [dialogAbierto, setDialogAbierto] = useState(false);
    const { toast } = useToast();

    const marcarComoResuelta = (id: string) => {
        setAlertas(alertas.map(a => a.id === id ? { ...a, estado: "Resuelta" } : a));
        toast({
            title: "Alerta resuelta",
            description: "La alerta ha sido marcada como resuelta correctamente",
            type: "success"
        });
        setDialogAbierto(false);
    };

    const solicitarAyuda = (alerta: Alert) => {
        toast({
            title: "Solicitud de ayuda enviada",
            description: `Un técnico especializado revisará la alerta ${alerta.id} en las próximas 2 horas`,
            type: "info"
        });
    };

    const verDetalles = (alerta: Alert) => {
        setAlertaSeleccionada(alerta);
        setDialogAbierto(true);
    };

    const alertasActivas = alertas.filter(a => a.estado === "Activa");
    const alertasResueltas = alertas.filter(a => a.estado === "Resuelta");

    return (
        <div className={styles.container}>
            <div>
                <h1 className={styles.headerTitle}>Centro de Alertas</h1>
                <p className={styles.headerDescription}>
                    Gestione y responda a las alertas de seguridad del sistema
                </p>
            </div>

            <div className={styles.statsGrid}>
                <StatCard
                    title="Alertas Activas"
                    value={alertasActivas.length}
                    description="Requieren atención"
                    icon={<AlertTriangle />}
                    variant="danger"
                />

                <StatCard
                    title="Alertas Resueltas"
                    value={alertasResueltas.length}
                    description="En las últimas 24h"
                    icon={<CheckCircle />}
                    variant="success"
                />

                <StatCard
                    title="Alertas Críticas"
                    value={alertasActivas.filter(a => a.nivel === "Alta").length}
                    description="Prioridad alta"
                    icon={<AlertTriangle />}
                    variant="danger"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Alertas Activas</CardTitle>
                    <CardDescription>
                        Alertas que requieren atención inmediata o seguimiento
                    </CardDescription>
                </CardHeader>
                <CardContent className={styles.alertList}>
                    {alertasActivas.length === 0 ? (
                        <div className={styles.emptyState}>
                            <CheckCircle className={styles.emptyIcon} />
                            <p>No hay alertas activas en este momento</p>
                        </div>
                    ) : (
                        alertasActivas.map((alerta) => (
                            <div key={alerta.id} className={styles.alertItem}>
                                <div className={styles.alertHeader}>
                                    <div className={styles.flex1}>
                                        <div className={styles.alertMeta}>
                                            <StatusBadge status={alerta.nivel} type="alert" />
                                            <span className={styles.alertTeam}>{alerta.equipo_nombre}</span>
                                            <span className={styles.alertDate}>
                                                {new Date(alerta.fecha).toLocaleString('es-ES')}
                                            </span>
                                        </div>
                                        <p className={styles.alertDesc}>{alerta.descripcion}</p>
                                        <div className={styles.alertRec}>
                                            <p className={styles.alertRecTitle}>Recomendación:</p>
                                            <p>{alerta.recomendacion}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.alertActions}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => verDetalles(alerta)}
                                    >
                                        Ver Detalles
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => marcarComoResuelta(alerta.id)}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Marcar como Resuelta
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => solicitarAyuda(alerta)}
                                    >
                                        <HelpCircle className="h-4 w-4 mr-2" />
                                        Solicitar Ayuda
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Alertas Resueltas</CardTitle>
                    <CardDescription>Historial de alertas gestionadas</CardDescription>
                </CardHeader>
                <CardContent className={styles.resolvedList}>
                    {alertasResueltas.map((alerta) => (
                        <div key={alerta.id} className={styles.resolvedItem}>
                            <div className={styles.resolvedHeader}>
                                <div>
                                    <div className={styles.resolvedMeta}>
                                        <CheckCircle className="h-4 w-4 text-success" />
                                        <span className={styles.fontMedium}>{alerta.equipo_nombre}</span>
                                        <StatusBadge status={alerta.nivel} type="alert" />
                                    </div>
                                    <p className={styles.resolvedDesc}>{alerta.descripcion}</p>
                                </div>
                                <span className={styles.alertDate}>
                                    {new Date(alerta.fecha).toLocaleString('es-ES')}
                                </span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalles de la Alerta</DialogTitle>
                        <DialogDescription>
                            Información completa y pasos recomendados
                        </DialogDescription>
                    </DialogHeader>

                    {alertaSeleccionada && (
                        <div className={styles.dialogContent}>
                            <div className={styles.dialogMeta}>
                                <div className={styles.dialogHeaderRow}>
                                    <StatusBadge status={alertaSeleccionada.nivel} type="alert" />
                                    <span className={styles.fontMedium}>{alertaSeleccionada.equipo_nombre}</span>
                                </div>
                                <p className={styles.alertDate}>
                                    {new Date(alertaSeleccionada.fecha).toLocaleString('es-ES')}
                                </p>
                            </div>

                            <div>
                                <p className={cn(styles.fontMedium, styles.mb1)}>Descripción:</p>
                                <p className={styles.textSm}>{alertaSeleccionada.descripcion}</p>
                            </div>

                            <div className={styles.dialogRec}>
                                <p className={cn(styles.fontMedium, styles.mb1)}>Siguiente paso recomendado:</p>
                                <p className={styles.textSm}>{alertaSeleccionada.recomendacion}</p>
                            </div>

                            <div className={styles.dialogFooter}>
                                <Button
                                    onClick={() => marcarComoResuelta(alertaSeleccionada.id)}
                                    className={styles.flex1}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Marcar como Resuelta
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => solicitarAyuda(alertaSeleccionada)}
                                    className={styles.flex1}
                                >
                                    <HelpCircle className="h-4 w-4 mr-2" />
                                    Solicitar Ayuda
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
