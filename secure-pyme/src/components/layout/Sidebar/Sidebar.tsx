"use client";

import React from 'react';
import styles from './Sidebar.module.css';
import { NavLink } from '../NavLink';
import { Home, Server, AlertTriangle, History, HardDrive, Shield, Activity, FileText, CreditCard, LogOut } from "lucide-react";
import { Button } from '@/components/ui/Button/Button';

// Mock Auth Context for pure UI parity
const user = { nombre: "Admin User", rol: "Administrador" };

const menuItems = [
    { title: "Dashboard", url: "/", icon: Home, roles: ["Administrador", "Operativo"] },
    { title: "Equipos", url: "/equipos", icon: Server, roles: ["Administrador", "Operativo"] },
    { title: "Alertas", url: "/alertas", icon: AlertTriangle, roles: ["Administrador", "Operativo"] },
    { title: "Historial", url: "/historial", icon: History, roles: ["Administrador", "Operativo"] },
    { title: "Respaldos", url: "/respaldos", icon: HardDrive, roles: ["Administrador", "Operativo"] },
    { title: "Políticas", url: "/politicas", icon: Shield, roles: ["Administrador"] },
    { title: "Análisis", url: "/analisis", icon: Activity, roles: ["Administrador"] },
    { title: "Reportes", url: "/reportes", icon: FileText, roles: ["Administrador"] },
    { title: "Planes", url: "/planes", icon: CreditCard, roles: ["Administrador"] },
];

export const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <Shield className={styles.headerIcon} />
                <span className={styles.brand}>SecurePYME</span>
            </div>

            <div className={styles.content}>
                <div>
                    <div className={styles.groupLabel}>Menú Principal</div>
                    <nav className={styles.menu}>
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.title}
                                href={item.url}
                                className={styles.link}
                                activeClassName={styles.activeLink}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.title}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className={styles.footer}>
                    <div className={styles.userInfo}>
                        <p className="font-medium">{user.nombre}</p>
                        <p className={styles.userRole}>{user.rol}</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                    </Button>
                </div>
            </div>
        </aside>
    );
};
