"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { SecurityPolicy } from "@/types";
import { Switch } from "@/components/ui/Switch/Switch";
import { Badge } from "@/components/ui/Badge/Badge";
import { useToast } from "@/components/ui/Toast/Toast";
import { Shield, CheckCircle } from "lucide-react";
import { mockPolicies } from "@/lib/mockData";
import { StatCard } from "@/components/ui/StatCard/StatCard";

export default function Politicas() {
    // Initialize with all disabled as requested until fetched
    const [politicas, setPoliticas] = useState<SecurityPolicy[]>(
        mockPolicies.map(p => ({ ...p, habilitada: false }))
    );
    const { toast } = useToast();
    // Simplified Auth for this prototype - expecting Admin access
    const user = { rol: "Administrador" };

    // Fetch policies on mount to sync with backend
    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const res = await fetch('/api/policies');
                if (res.ok) {
                    const data = await res.json(); // Array of { id, enabled }

                    if (Array.isArray(data)) {
                        setPoliticas(currentPolicies =>
                            currentPolicies.map(p => {
                                const remoteState = data.find((d: any) => d.id === p.id);
                                return remoteState
                                    ? { ...p, habilitada: remoteState.enabled }
                                    : p;
                            })
                        );
                    }
                }
            } catch (error) {
                console.error("Error fetching policies:", error);
            }
        };
        fetchPolicies();
    }, []);

    const togglePolitica = async (id: string, currentStatus: boolean) => {
        if (user?.rol !== "Administrador") {
            toast({
                title: "Acceso denegado",
                description: "Solo los administradores pueden modificar políticas de seguridad",
                type: "warning",
            });
            return;
        }

        // Optimistic Update
        const updatedPolicies = politicas.map(p =>
            p.id === id ? { ...p, habilitada: !p.habilitada } : p
        );
        setPoliticas(updatedPolicies);

        const politica = politicas.find(p => p.id === id);
        const nuevoEstado = !currentStatus;

        try {
            const res = await fetch('/api/policies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ policyId: id, enabled: nuevoEstado }),
            });

            if (!res.ok) {
                throw new Error('Failed to update');
            }

            toast({
                title: nuevoEstado ? "Política habilitada" : "Política deshabilitada",
                description: `${politica?.nombre} ha sido ${nuevoEstado ? "activada" : "desactivada"} correctamente`,
                type: "success"
            });
        } catch (error) {
            // Revert on error
            setPoliticas(politicas);
            toast({
                title: "Error",
                description: "No se pudo actualizar la política",
                type: "error"
            });
        }
    };

    const habilitadas = politicas.filter(p => p.habilitada).length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Políticas de Seguridad</h1>
                <p className="text-muted-foreground">
                    Configure reglas de protección que se aplicarán automáticamente a todos los equipos
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <StatCard
                    title="Políticas Activas"
                    value={habilitadas}
                    description={`de ${politicas.length} políticas disponibles`}
                    icon={<Shield />}
                    iconColor="text-success"
                />

                <StatCard
                    title="Equipos Protegidos"
                    value={8}
                    description="Todas las políticas se aplican automáticamente"
                    icon={<CheckCircle />}
                    iconColor="text-primary"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Configuración de Políticas</CardTitle>
                    <CardDescription>
                        Active o desactive políticas de seguridad según las necesidades de su empresa
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {politicas.map((politica) => (
                        <div
                            key={politica.id}
                            className="flex items-start justify-between p-4 border rounded-lg"
                        >
                            <div className="flex-1 mr-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="font-medium">{politica.nombre}</p>
                                    {politica.habilitada ? (
                                        <Badge className="bg-success text-success-foreground">Activa</Badge>
                                    ) : (
                                        <Badge variant="secondary">Inactiva</Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">{politica.descripcion}</p>
                            </div>
                            <Switch
                                checked={politica.habilitada}
                                onCheckedChange={() => togglePolitica(politica.id, politica.habilitada)}
                                disabled={user?.rol !== "Administrador"}
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Keeping Recommendations Card for parity */}
            <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle>Recomendaciones de Seguridad</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                            <span>Mantenga activas al menos 3 políticas de seguridad básicas</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                            <span>Revise y actualice las políticas mensualmente según las necesidades del negocio</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                            <span>Documente los cambios de políticas para auditorías futuras</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
