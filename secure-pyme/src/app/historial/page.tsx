"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { mockIncidents } from "@/lib/mockData";
import { Badge } from "@/components/ui/Badge/Badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table/Table";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard/StatCard";
import styles from "./page.module.css";
import { cn } from "@/lib/utils";

// Types extracted locally
interface Incident {
    id: string;
    fecha: string;
    equipo_nombre: string;
    equipo_id: string;
    tipo: string;
    descripcion: string;
    estado: "Resuelto" | "Mitigado" | "En investigación" | string;
    acciones: string[];
}

export default function Historial() {
    const [filtroEstado, setFiltroEstado] = useState<string>("todos");
    const [filtroPeriodo, setFiltroPeriodo] = useState<string>("30");

    const incidentesFiltrados = mockIncidents.filter(incidente => {
        const cumpleFiltroEstado = filtroEstado === "todos" || incidente.estado === filtroEstado;

        const fechaIncidente = new Date(incidente.fecha);
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - parseInt(filtroPeriodo));
        const cumpleFiltroPeriodo = fechaIncidente >= fechaLimite;

        return cumpleFiltroEstado && cumpleFiltroPeriodo;
    });

    const getStatusIcon = (estado: string) => {
        switch (estado) {
            case "Resuelto":
                return <CheckCircle2 className="h-4 w-4 text-success" />;
            case "Mitigado":
                return <AlertCircle className="h-4 w-4 text-warning" />;
            case "En investigación":
                return <Clock className="h-4 w-4 text-primary" />;
            default:
                return null;
        }
    };

    const getStatusColor = (estado: string): any => {
        switch (estado) {
            case "Resuelto":
                return "subtleSuccess";
            case "Mitigado":
                return "subtleWarning";
            case "En investigación":
                return "subtlePrimary";
            default:
                return "secondary";
        }
    };

    const resueltos = mockIncidents.filter(i => i.estado === "Resuelto").length;
    const mitigados = mockIncidents.filter(i => i.estado === "Mitigado").length;
    const enInvestigacion = mockIncidents.filter(i => i.estado === "En investigación").length;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Historial de Incidentes</h1>
                <p className={styles.subtitle}>
                    Registro completo de eventos de seguridad y acciones tomadas
                </p>
            </div>

            <div className={styles.statsGrid}>
                <StatCard
                    title="Resueltos"
                    value={resueltos}
                    description="Completamente solucionados"
                    icon={<CheckCircle2 />}
                    variant="success"
                />

                <StatCard
                    title="Mitigados"
                    value={mitigados}
                    description="Riesgo reducido"
                    icon={<AlertCircle />}
                    variant="warning"
                />

                <StatCard
                    title="En Investigación"
                    value={enInvestigacion}
                    description="Análisis en curso"
                    icon={<Clock />}
                    variant="primary"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                    <CardDescription>Filtre incidentes por estado y período de tiempo</CardDescription>
                </CardHeader>
                <CardContent className={styles.filters}>
                    <div className={styles.filterSelect}>
                        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                            <SelectTrigger>
                                <SelectValue placeholder="Estado del incidente" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos los estados</SelectItem>
                                <SelectItem value="Resuelto">Resuelto</SelectItem>
                                <SelectItem value="Mitigado">Mitigado</SelectItem>
                                <SelectItem value="En investigación">En investigación</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className={styles.filterSelect}>
                        <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                            <SelectTrigger>
                                <SelectValue placeholder="Período" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Últimos 7 días</SelectItem>
                                <SelectItem value="30">Últimos 30 días</SelectItem>
                                <SelectItem value="90">Últimos 90 días</SelectItem>
                                <SelectItem value="365">Último año</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Registro de Incidentes ({incidentesFiltrados.length})</CardTitle>
                    <CardDescription>Listado detallado de eventos de seguridad</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Fecha y Hora</TableHead>
                                <TableHead>Equipo</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Acciones Tomadas</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {incidentesFiltrados.map((incidente) => (
                                <TableRow key={incidente.id}>
                                    <TableCell className="font-mono text-xs">{incidente.id}</TableCell>
                                    <TableCell className="text-sm">
                                        {new Date(incidente.fecha).toLocaleString('es-ES')}
                                    </TableCell>
                                    <TableCell className="font-medium">{incidente.equipo_nombre}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{incidente.tipo}</Badge>
                                    </TableCell>
                                    <TableCell className="max-w-xs text-sm">{incidente.descripcion}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(incidente.estado)}
                                            <Badge variant={getStatusColor(incidente.estado)}>
                                                {incidente.estado}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <ul className="text-xs space-y-1">
                                            {incidente.acciones.map((accion, idx) => (
                                                <li key={idx} className="text-muted-foreground">• {accion}</li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Línea de Tiempo</CardTitle>
                    <CardDescription>Vista cronológica de los incidentes recientes</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className={styles.timelineList}>
                        {incidentesFiltrados.map((incidente, index) => (
                            <div key={incidente.id} className={styles.timelineItem}>
                                <div className={styles.timelineMarkerColumn}>
                                    <div className={styles.markerIcon}>
                                        {getStatusIcon(incidente.estado)}
                                    </div>
                                    {index < incidentesFiltrados.length - 1 && (
                                        <div className={styles.timelineLine} />
                                    )}
                                </div>
                                <div className={styles.timelineContent}>
                                    <div className={styles.timelineHeader}>
                                        <div>
                                            <p className="font-medium">{incidente.equipo_nombre}</p>
                                            <p className="text-sm text-muted-foreground">{incidente.tipo}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(incidente.fecha).toLocaleDateString('es-ES')}
                                        </span>
                                    </div>
                                    <p className="text-sm mb-2">{incidente.descripcion}</p>
                                    <div className={styles.actionsWrapper}>
                                        <Badge variant={getStatusColor(incidente.estado)}>
                                            {incidente.estado}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {incidente.acciones.length} acción(es) tomada(s)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
