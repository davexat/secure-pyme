"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { mockEquipment, mockAlerts } from "@/lib/mockData";
import { Shield, AlertTriangle, HardDrive, Activity } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table/Table";
import { Button } from "@/components/ui/Button/Button";
import Link from 'next/link';
import styles from './page.module.css';
import { StatCard } from "@/components/ui/StatCard/StatCard";

export default function Dashboard() {
  const seguros = mockEquipment.filter(e => e.estado_seguridad === "Seguro").length;
  const enRiesgo = mockEquipment.filter(e => e.estado_seguridad === "Advertencia").length;
  const amenazados = mockEquipment.filter(e => e.estado_seguridad === "Amenaza").length;
  const alertasActivas = mockAlerts.filter(a => a.estado === "Activa").length;

  const porcentajeSeguro = Math.round((seguros / mockEquipment.length) * 100);
  const porcentajeRiesgo = Math.round((enRiesgo / mockEquipment.length) * 100);
  // Unused variable kept for logic parity if needed later, but commented out to avoid linter warning if strict
  // const porcentajeAmenaza = Math.round((amenazados / mockEquipment.length) * 100);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard de Seguridad</h1>
        <p className={styles.subtitle}>Vista general del estado de protección de su empresa</p>
      </div>

      <div className={styles.statusGrid}>
        <StatCard
          title="Equipos Seguros"
          value={`${porcentajeSeguro}%`}
          description={`${seguros} de ${mockEquipment.length} equipos`}
          icon={<Shield />}
          variant="success"
        />

        <StatCard
          title="En Riesgo"
          value={`${porcentajeRiesgo}%`}
          description={`${enRiesgo} equipos requieren atención`}
          icon={<AlertTriangle />}
          variant="warning"
        />

        <StatCard
          title="Amenazas Activas"
          value={amenazados}
          description="Requieren acción inmediata"
          icon={<Activity />}
          variant="danger"
        />

        <StatCard
          title="Alertas Activas"
          value={alertasActivas}
          description="Notificaciones pendientes"
          icon={<HardDrive />}
          variant="primary"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estado de Equipos</CardTitle>
          <CardDescription>Resumen de todos los equipos registrados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipo</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Estado Seguridad</TableHead>
                <TableHead>Conexión Agente</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEquipment.map((equipo) => (
                <TableRow key={equipo.id}>
                  <TableCell className="font-medium">{equipo.nombre}</TableCell>
                  <TableCell>{equipo.usuario}</TableCell>
                  <TableCell>
                    <StatusBadge status={equipo.estado_seguridad} type="security" />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={equipo.estado_conexion_agente} type="connection" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className={styles.tableActions}>
            <Link href="/equipos">
              <Button>Ver todos los equipos</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {alertasActivas > 0 && (
        <Card className="border-danger">
          <CardHeader>
            <CardTitle className="text-danger">Alertas que Requieren Atención</CardTitle>
            <CardDescription>Revise y gestione las alertas activas del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={styles.alertList}>
              {mockAlerts.filter(a => a.estado === "Activa").map((alerta) => (
                <div key={alerta.id} className={styles.alertItem}>
                  <div className={styles.alertContent}>
                    <div className={styles.alertHeader}>
                      <StatusBadge status={alerta.nivel} type="alert" />
                      <span className="font-medium">{alerta.equipo_nombre}</span>
                    </div>
                    <p className={styles.alertDescription}>{alerta.descripcion}</p>
                  </div>
                  <Link href="/alertas">
                    <Button size="sm" variant="outline">
                      Ver detalles
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
