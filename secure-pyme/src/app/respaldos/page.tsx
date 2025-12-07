"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { mockBackups } from "@/lib/mockData";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table/Table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { useToast } from "@/hooks/use-toast";
import { HardDrive, CheckCircle, Clock, XCircle, Download, File, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/Progress";
import { Checkbox } from "@/components/ui/Checkbox";
import { StatCard } from "@/components/ui/StatCard/StatCard";
import styles from "./page.module.css";
import { cn } from "@/lib/utils";

interface Backup {
    id: string;
    equipo_id: string;
    equipo_nombre: string;
    fecha: string;
    tamaño: string;
    integridad: "Verificado" | "Pendiente" | "Error" | string;
}

export default function Respaldos() {
    const [dialogAbierto, setDialogAbierto] = useState(false);
    const [respaldoSeleccionado, setRespaldoSeleccionado] = useState<Backup | null>(null);
    const [restaurando, setRestaurando] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [archivosSeleccionados, setArchivosSeleccionados] = useState<string[]>([]);
    const { toast } = useToast();

    const verificados = mockBackups.filter(b => b.integridad === "Verificado").length;
    const pendientes = mockBackups.filter(b => b.integridad === "Pendiente").length;
    const errores = mockBackups.filter(b => b.integridad === "Error").length;

    const getVersiones = (backup: Backup) => {
        const baseDate = new Date(backup.fecha);
        return [
            {
                id: `${backup.id}-v1`,
                fecha: backup.fecha,
                tipo: "Completo",
                tamaño: backup.tamaño,
                esReciente: true
            },
            {
                id: `${backup.id}-v2`,
                fecha: new Date(baseDate.getTime() - 10 * 60000).toISOString(),
                tipo: "Checkpoint (10 min)",
                tamaño: "2.3 GB",
                esReciente: false
            },
            {
                id: `${backup.id}-v3`,
                fecha: new Date(baseDate.getTime() - 20 * 60000).toISOString(),
                tipo: "Checkpoint (20 min)",
                tamaño: "1.8 GB",
                esReciente: false
            },
            {
                id: `${backup.id}-v4`,
                fecha: new Date(baseDate.getTime() - 30 * 60000).toISOString(),
                tipo: "Checkpoint (30 min)",
                tamaño: "2.1 GB",
                esReciente: false
            },
        ];
    };

    const getArchivosCriticos = (equipoId: string): string[] => {
        const archivosPorEquipo: Record<string, string[]> = {
            "EQ-003": [
                "C:\\Users\\juan.p\\Documents\\Cotizaciones_2025.xlsx",
                "C:\\Users\\juan.p\\Documents\\Clientes_Activos.docx",
                "C:\\Users\\juan.p\\Desktop\\Ventas_Enero.pdf",
                "C:\\Program Files\\ERP\\database\\ventas.db",
                "C:\\Users\\juan.p\\AppData\\Local\\Apps\\config.json"
            ],
            "EQ-002": [
                "/var/www/html/facturas/enero_2025/",
                "/home/sistemas/backups/db_diario.sql",
                "/etc/apache2/sites-available/facturacion.conf",
                "/home/sistemas/scripts/backup_automatico.sh"
            ],
            "EQ-006": [
                "C:\\POS\\Transacciones\\turno_matutino.dat",
                "C:\\POS\\Config\\terminal_config.ini",
                "C:\\Users\\cajero1\\Documents\\Arqueo_Diario.xlsx"
            ]
        };
        return archivosPorEquipo[equipoId] || [
            "/home/user/documentos/archivo1.txt",
            "/home/user/documentos/archivo2.pdf",
            "/home/user/configuracion/settings.conf"
        ];
    };

    const abrirRestauracion = (backup: Backup) => {
        setRespaldoSeleccionado(backup);
        setArchivosSeleccionados(getArchivosCriticos(backup.equipo_id));
        setDialogAbierto(true);
    };

    const ejecutarRestauracion = () => {
        if (archivosSeleccionados.length === 0) {
            toast({
                title: "Error",
                description: "Seleccione al menos un archivo para restaurar",
                variant: "destructive"
            });
            return;
        }

        setRestaurando(true);
        setProgreso(0);

        const intervalo = setInterval(() => {
            setProgreso(prev => {
                if (prev >= 100) {
                    clearInterval(intervalo);
                    setRestaurando(false);
                    toast({
                        title: "Restauración completada",
                        description: `${archivosSeleccionados.length} archivo(s) restaurados exitosamente`,
                        type: "success"
                    });
                    setDialogAbierto(false);
                    setArchivosSeleccionados([]);
                    return 100;
                }
                return prev + 10;
            });
        }, 400);
    };

    const toggleArchivo = (archivo: string) => {
        setArchivosSeleccionados(prev =>
            prev.includes(archivo)
                ? prev.filter(a => a !== archivo)
                : [...prev, archivo]
        );
    };

    const toggleTodos = () => {
        if (!respaldoSeleccionado) return;
        const todos = getArchivosCriticos(respaldoSeleccionado.equipo_id);
        if (archivosSeleccionados.length === todos.length) {
            setArchivosSeleccionados([]);
        } else {
            setArchivosSeleccionados(todos);
        }
    };

    const getIntegridadBadge = (integridad: string) => {
        switch (integridad) {
            case "Verificado":
                return <Badge variant="subtleSuccess"><CheckCircle className="h-3 w-3 mr-1" />Verificado</Badge>;
            case "Pendiente":
                return <Badge variant="subtleWarning"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
            case "Error":
                return <Badge variant="subtleDanger"><XCircle className="h-3 w-3 mr-1" />Error</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestión de Respaldos</h1>
                    <p className={styles.subtitle}>
                        Administre copias de seguridad automáticas y restaure información cuando sea necesario
                    </p>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <StatCard
                    title="Respaldos Verificados"
                    value={verificados}
                    description="Integridad confirmada"
                    icon={<CheckCircle />}
                    variant="success"
                />

                <StatCard
                    title="En Verificación"
                    value={pendientes}
                    description="Proceso en curso"
                    icon={<Clock />}
                    variant="warning"
                />

                <StatCard
                    title="Total Almacenado"
                    value={`${mockBackups.reduce((acc, b) => acc + parseInt(b.tamaño), 0)} GB`}
                    description="Espacio utilizado"
                    icon={<HardDrive />}
                    variant="primary"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Respaldos Automáticos</CardTitle>
                    <CardDescription>
                        Listado de copias de seguridad realizadas automáticamente por el sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Equipo</TableHead>
                                <TableHead>Fecha y Hora</TableHead>
                                <TableHead>Tamaño</TableHead>
                                <TableHead>Estado de Integridad</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockBackups.map((backup) => (
                                <TableRow key={backup.id}>
                                    <TableCell className="font-mono text-xs">{backup.id}</TableCell>
                                    <TableCell className="font-medium">{backup.equipo_nombre}</TableCell>
                                    <TableCell>{new Date(backup.fecha).toLocaleString('es-ES')}</TableCell>
                                    <TableCell>{backup.tamaño}</TableCell>
                                    <TableCell>{getIntegridadBadge(backup.integridad)}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => abrirRestauracion(backup)}
                                            disabled={backup.integridad === "Error"}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Restaurar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Configuración de Respaldos</CardTitle>
                    <CardDescription>
                        Los respaldos automáticos están configurados para ejecutarse diariamente con checkpoints cada 10 minutos
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className={styles.spaceY4}>
                        <div className={styles.backupItem}>
                            <div>
                                <p className="font-medium">Frecuencia de respaldo completo</p>
                                <p className="text-sm text-muted-foreground">Diario a las 02:00 AM</p>
                            </div>
                            <Badge>Activo</Badge>
                        </div>
                        <div className={styles.backupItem}>
                            <div>
                                <p className="font-medium">Checkpoints incrementales</p>
                                <p className="text-sm text-muted-foreground">Cada 10 minutos</p>
                            </div>
                            <Badge variant="subtleSuccess">Habilitado</Badge>
                        </div>
                        <div className={styles.backupItem}>
                            <div>
                                <p className="font-medium">Retención de datos</p>
                                <p className="text-sm text-muted-foreground">Mantener últimos 30 respaldos</p>
                            </div>
                            <Badge>Configurado</Badge>
                        </div>
                        <div className={styles.backupItem}>
                            <div>
                                <p className="font-medium">Verificación de integridad</p>
                                <p className="text-sm text-muted-foreground">Automática después de cada respaldo</p>
                            </div>
                            <Badge variant="subtleSuccess">Habilitado</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
                <DialogContent className={styles.dialogContent}>
                    <DialogHeader>
                        <DialogTitle>Restaurar Respaldo - {respaldoSeleccionado?.equipo_nombre}</DialogTitle>
                        <DialogDescription>
                            Seleccione la versión y los archivos críticos a restaurar
                        </DialogDescription>
                    </DialogHeader>

                    {respaldoSeleccionado && (
                        <div className={styles.spaceY4}>
                            {!restaurando ? (
                                <>
                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Versiones Disponibles
                                        </h4>
                                        <div className="space-y-2">
                                            {getVersiones(respaldoSeleccionado).map((version) => (
                                                <Card key={version.id} className={version.esReciente ? "border-primary" : ""}>
                                                    <CardContent className="p-3 flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                {new Date(version.fecha).toLocaleString('es-EC')}
                                                                {version.esReciente && <Badge className="ml-2" variant="default">Más reciente</Badge>}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">{version.tipo} - {version.tamaño}</p>
                                                        </div>
                                                        <Button variant="ghost" size="sm">Seleccionar</Button>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            <File className="h-4 w-4" />
                                            Archivos Críticos Afectados
                                        </h4>
                                        <Card>
                                            <CardContent className="p-3">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Checkbox
                                                            checked={archivosSeleccionados.length === getArchivosCriticos(respaldoSeleccionado.equipo_id).length}
                                                            onCheckedChange={toggleTodos}
                                                        />
                                                        <span className="text-sm font-medium">Seleccionar todos</span>
                                                    </div>
                                                    {getArchivosCriticos(respaldoSeleccionado.equipo_id).map((archivo) => (
                                                        <div key={archivo} className="flex items-center gap-2 pl-6">
                                                            <Checkbox
                                                                checked={archivosSeleccionados.includes(archivo)}
                                                                onCheckedChange={() => toggleArchivo(archivo)}
                                                            />
                                                            <span className="text-sm font-mono text-muted-foreground">{archivo}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-3">
                                                    {archivosSeleccionados.length} archivo(s) seleccionado(s)
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="bg-muted p-3 rounded-md">
                                        <p className="text-sm">
                                            <strong>Nota:</strong> Los archivos seleccionados serán restaurados a su estado en el punto de respaldo.
                                            Los archivos actuales serán respaldados antes de sobrescribirse.
                                        </p>
                                    </div>

                                    <div className={styles.restoreActions}>
                                        <Button
                                            onClick={ejecutarRestauracion}
                                            className="flex-1"
                                            disabled={archivosSeleccionados.length === 0}
                                        >
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Restaurar {archivosSeleccionados.length} Archivo(s)
                                        </Button>
                                        <Button variant="outline" onClick={() => setDialogAbierto(false)}>
                                            Cancelar
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Progress value={progreso} className="w-full" />
                                    <p className="text-sm text-muted-foreground text-center">
                                        Restaurando {archivosSeleccionados.length} archivo(s)... {progreso}%
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
