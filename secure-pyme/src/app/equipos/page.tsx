"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { mockEquipment } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table/Table";
import { Button } from "@/components/ui/Button/Button";
import { Badge } from "@/components/ui/Badge/Badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useToast } from "@/hooks/use-toast";
import { Eye, Play, Download, RefreshCw, AlertTriangle, Plus } from "lucide-react";
import { Progress } from "@/components/ui/Progress";
import styles from "./page.module.css";

// Types extracted locally since we don't have a shared types file yet or it's implicitly imported
// Assuming types match mockData
interface Equipment {
    id: string;
    nombre: string;
    usuario: string;
    OS: string;
    estado_seguridad: string;
    estado_conexion_agente: string;
    version_agente: string;
    ubicacion: string;
    // plan: string; // Removed
}

export default function Equipos() {
    const [filtroEstado, setFiltroEstado] = useState<string>("todos");
    const [filtroUbicacion, setFiltroUbicacion] = useState<string>("todos");
    const [equipoSeleccionado, setEquipoSeleccionado] = useState<string | null>(null);
    const [dialogAbierto, setDialogAbierto] = useState(false);
    const [dialogDetallesAbierto, setDialogDetallesAbierto] = useState(false);
    const [dialogAgregarAbierto, setDialogAgregarAbierto] = useState(false);
    const [accionEnProgreso, setAccionEnProgreso] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [claveAgente, setClaveAgente] = useState("");
    const { toast } = useToast();

    const equiposFiltrados = mockEquipment.filter(equipo => {
        const cumpleFiltroEstado = filtroEstado === "todos" || equipo.estado_seguridad === filtroEstado;
        const cumpleFiltroUbicacion = filtroUbicacion === "todos" || equipo.ubicacion === filtroUbicacion;
        return cumpleFiltroEstado && cumpleFiltroUbicacion;
    });

    const ubicaciones = Array.from(new Set(mockEquipment.map(e => e.ubicacion)));

    const equiposActuales = mockEquipment.length;
    // const maxEquipos = maxEquiposPorPlan[planActual]; // Removed limits

    const getThreatDetails = (equipo: Equipment) => {
        if (equipo.estado_seguridad === "Amenaza") {
            return {
                title: "Amenaza Crítica Detectada",
                description: "Se detectaron actividades sospechosas en este equipo que requieren atención inmediata.",
                details: [
                    "Cambio masivo de archivos (>500 archivos modificados en 10 min)",
                    "Patrón consistente con ransomware detectado",
                    "Procesos sospechosos ejecutándose en segundo plano",
                    "Comunicación con IPs en listas de amenazas"
                ],
                actions: [
                    "Aislar inmediatamente el equipo de la red",
                    "No apagar el equipo (preservar evidencia forense)",
                    "Restaurar desde el último respaldo verificado",
                    "Ejecutar análisis forense completo"
                ]
            };
        } else if (equipo.estado_seguridad === "Advertencia") {
            return {
                title: "Advertencia de Seguridad",
                description: "Se detectaron condiciones que podrían comprometer la seguridad del equipo.",
                details: [
                    "Versión del agente desactualizada con vulnerabilidades conocidas",
                    "Políticas de seguridad no completamente aplicadas",
                    "Intentos de conexión de dispositivos USB no autorizados",
                    "Certificados SSL próximos a vencer"
                ],
                actions: [
                    "Actualizar agente a la última versión",
                    "Verificar y aplicar todas las políticas de seguridad",
                    "Revisar lista de dispositivos autorizados",
                    "Programar mantenimiento preventivo"
                ]
            };
        }
        return null;
    };

    const simularAccion = (accion: string, equipoNombre: string) => {
        setAccionEnProgreso(true);
        setProgreso(0);

        const intervalo = setInterval(() => {
            setProgreso(prev => {
                if (prev >= 100) {
                    clearInterval(intervalo);
                    setAccionEnProgreso(false);
                    toast({
                        title: "Acción completada",
                        description: `${accion} en ${equipoNombre} finalizado exitosamente`,
                        type: "success"
                    });
                    setDialogAbierto(false);
                    return 100;
                }
                return prev + 20;
            });
        }, 500);
    };

    const verDetalles = (equipoId: string) => {
        const equipo = mockEquipment.find(e => e.id === equipoId);
        if (equipo && (equipo.estado_seguridad === "Amenaza" || equipo.estado_seguridad === "Advertencia")) {
            setEquipoSeleccionado(equipoId);
            setDialogDetallesAbierto(true);
        } else {
            setEquipoSeleccionado(equipoId);
            setDialogAbierto(true);
            setProgreso(0);
        }
    };

    const agregarDispositivo = () => {
        if (!claveAgente.trim()) {
            toast({
                title: "Error",
                description: "Por favor ingrese la clave del agente",
                variant: "destructive"
            });
            return;
        }

        toast({
            title: "Dispositivo agregado",
            description: `El dispositivo con clave ${claveAgente} se está conectando...`,
            type: "success"
        });
        setDialogAgregarAbierto(false);
        setClaveAgente("");
    };

    const equipoActual = mockEquipment.find(e => e.id === equipoSeleccionado);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestión de Equipos</h1>
                    <p className={styles.subtitle}>
                        Administre todos los equipos conectados con sus agentes de seguridad
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.stats}>
                        <p className={styles.statsLabel}>Total Equipos</p>
                        <p className={styles.statsValue}>{equiposActuales}</p>
                    </div>
                    <Button
                        onClick={() => setDialogAgregarAbierto(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Equipo
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                    <CardDescription>Filtre equipos por estado de seguridad y ubicación</CardDescription>
                </CardHeader>
                <CardContent className={styles.filtersContent}>
                    <div className={styles.filterItem}>
                        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                            <SelectTrigger>
                                <SelectValue placeholder="Estado de seguridad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos los estados</SelectItem>
                                <SelectItem value="Seguro">Seguro</SelectItem>
                                <SelectItem value="Advertencia">Advertencia</SelectItem>
                                <SelectItem value="Amenaza">Amenaza</SelectItem>
                                <SelectItem value="Desconectado">Desconectado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className={styles.filterItem}>
                        <Select value={filtroUbicacion} onValueChange={setFiltroUbicacion}>
                            <SelectTrigger>
                                <SelectValue placeholder="Ubicación" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todas las ubicaciones</SelectItem>
                                {ubicaciones.map(ubicacion => (
                                    <SelectItem key={ubicacion} value={ubicacion}>{ubicacion}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Equipos Registrados ({equiposFiltrados.length})</CardTitle>
                    <CardDescription>
                        Vista detallada de todos los equipos con sus agentes de seguridad
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Equipo</TableHead>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Sistema Operativo</TableHead>
                                <TableHead>Estado Seguridad</TableHead>
                                <TableHead>Conexión Agente</TableHead>
                                <TableHead>Versión</TableHead>
                                <TableHead>Ubicación</TableHead>
                                {/* <TableHead>Plan</TableHead> Removed */}
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {equiposFiltrados.map((equipo) => (
                                <TableRow key={equipo.id}>
                                    <TableCell className="font-mono text-xs">{equipo.id}</TableCell>
                                    <TableCell className="font-medium">{equipo.nombre}</TableCell>
                                    <TableCell>{equipo.usuario}</TableCell>
                                    <TableCell>{equipo.OS}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={equipo.estado_seguridad} type="security" />
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={equipo.estado_conexion_agente} type="connection" />
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{equipo.version_agente}</Badge>
                                    </TableCell>
                                    <TableCell>{equipo.ubicacion}</TableCell>
                                    {/* <TableCell>{equipo.plan}</TableCell> Removed */}
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => verDetalles(equipo.id)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Dialog de detalles normales */}
            <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detalles del Equipo</DialogTitle>
                        <DialogDescription>
                            Información completa y acciones disponibles
                        </DialogDescription>
                    </DialogHeader>

                    {equipoActual && (
                        <div className="space-y-4">
                            <div className={styles.dialogGrid}>
                                <div>
                                    <p className={styles.dialogLabel}>Nombre del equipo</p>
                                    <p className={styles.dialogTextValue}>{equipoActual.nombre}</p>
                                </div>
                                <div>
                                    <p className={styles.dialogLabel}>ID</p>
                                    <p className={styles.dialogValue}>{equipoActual.id}</p>
                                </div>
                                <div>
                                    <p className={styles.dialogLabel}>Usuario</p>
                                    <p className={styles.dialogTextValue}>{equipoActual.usuario}</p>
                                </div>
                                <div>
                                    <p className={styles.dialogLabel}>Sistema Operativo</p>
                                    <p className={styles.dialogTextValue}>{equipoActual.OS}</p>
                                </div>
                                <div>
                                    <p className={styles.dialogLabel}>Versión del Agente</p>
                                    <p className={styles.dialogTextValue}>{equipoActual.version_agente}</p>
                                </div>
                                {/* Plan details removed */}
                                <div>
                                    <p className={styles.dialogLabel}>Estado de Seguridad</p>
                                    <StatusBadge status={equipoActual.estado_seguridad} type="security" />
                                </div>
                                <div>
                                    <p className={styles.dialogLabel}>Conexión del Agente</p>
                                    <StatusBadge status={equipoActual.estado_conexion_agente} type="connection" />
                                </div>
                            </div>

                            {accionEnProgreso && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Procesando acción...</p>
                                    <Progress value={progreso} />
                                </div>
                            )}

                            <div className={styles.dialogActions}>
                                <Button
                                    variant="outline"
                                    onClick={() => simularAccion("Análisis completo", equipoActual.nombre)}
                                    disabled={accionEnProgreso}
                                >
                                    <Play className="h-4 w-4 mr-2" />
                                    Forzar Análisis
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => simularAccion("Descarga de respaldo", equipoActual.nombre)}
                                    disabled={accionEnProgreso}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Descargar Respaldo
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => simularAccion("Sincronización", equipoActual.nombre)}
                                    disabled={accionEnProgreso}
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Sincronizar Agente
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de detalles de amenaza/advertencia */}
            <Dialog open={dialogDetallesAbierto} onOpenChange={setDialogDetallesAbierto}>
                <DialogContent className="max-w-2xl">
                    {equipoActual && getThreatDetails(equipoActual) && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className={`h-5 w-5 ${equipoActual.estado_seguridad === "Amenaza" ? "text-danger" : "text-warning"}`} />
                                    {getThreatDetails(equipoActual)?.title}
                                </DialogTitle>
                                <DialogDescription>
                                    {equipoActual.nombre} - {equipoActual.id}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {getThreatDetails(equipoActual)?.description}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Detalles Detectados:</h4>
                                    <ul className={styles.threatList}>
                                        {getThreatDetails(equipoActual)?.details.map((detail, idx) => (
                                            <li key={idx} className={styles.threatItem}>
                                                <span className={styles.threatBullet}>•</span>
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Acciones Recomendadas:</h4>
                                    <ol className={styles.actionList}>
                                        {getThreatDetails(equipoActual)?.actions.map((action, idx) => (
                                            <li key={idx} className={styles.actionItem}>
                                                <span className={styles.actionIndex}>{idx + 1}.</span>
                                                <span>{action}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                <div className={styles.dialogFooter}>
                                    <Button variant="destructive" className={styles.fullWidthButton}>
                                        Aislar Equipo
                                    </Button>
                                    <Button variant="default" className={styles.fullWidthButton}>
                                        Ir a Respaldos
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog para agregar dispositivo */}
            <Dialog open={dialogAgregarAbierto} onOpenChange={setDialogAgregarAbierto}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Agregar Nuevo Dispositivo</DialogTitle>
                        <DialogDescription>
                            Ingrese la clave única del agente instalado en el dispositivo
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="agentKey">Clave del Agente</Label>
                            <Input
                                id="agentKey"
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                value={claveAgente}
                                onChange={(e) => setClaveAgente(e.target.value)}
                            />
                            <p className={styles.inputHelpText}>
                                La clave se genera automáticamente al instalar el agente en el dispositivo
                            </p>
                        </div>

                        <div className={styles.systemStatusCard}>
                            <p className="text-sm font-medium mb-1">Estado del Sistema</p>
                            <p className="text-xs text-muted-foreground">
                                Total de equipos gestionados: {equiposActuales}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={agregarDispositivo} className={styles.fullWidthButton}>
                                Conectar Dispositivo
                            </Button>
                            <Button variant="outline" onClick={() => setDialogAgregarAbierto(false)}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
