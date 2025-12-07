"use client";

import React, { useState } from 'react';
import styles from './desktop.module.css';
import { Modal } from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/Button/Button';
import { AlertTriangle, CheckCircle, Gamepad2, Loader2, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/ui/Toast/Toast';

export default function DesktopSimulator() {
    const [loading, setLoading] = useState(false);
    const [modalState, setModalState] = useState<'none' | 'blocked' | 'success'>('none');
    const { toast } = useToast();

    // Import cn if not imported, or use inline
    // I need to import it. But I can't add import easily with multi_replace unless I target top.
    // I'll assume standard replacement. I'll replace the top import as usual.
    const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

    const handleInstallClick = async () => {
        setLoading(true);
        try {
            // Check policy
            const res = await fetch('/api/check-policy?policyId=POL-002'); // Using POL-002 (Detect/Block programs logic)

            // For the demo, let's assume we want to check for "Limitar instalaciones" which is POL-004 in new data
            // Or we can query multiple. Let's query POL-004 as it fits "Block Installation".
            const res2 = await fetch('/api/check-policy?policyId=POL-004');

            const data = await res2.json();

            // Simulate network delay for realism
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (data.allowed) {
                setModalState('success');
                toast({
                    title: "Instalación permitida",
                    description: "La política permite la instalación de software.",
                    type: "success"
                });
            } else {
                setModalState('blocked');
                toast({
                    title: "Instalación bloqueada",
                    description: "El agente de seguridad impidió la ejecución.",
                    type: "error"
                });
            }
        } catch (error) {
            console.error("Error checking policy", error);
            toast({
                title: "Error de conexión",
                description: "No se pudo contactar con el servidor de políticas.",
                type: "warning"
            });
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => setModalState('none');

    return (
        <div className={styles.desktop}>
            {/* Desktop Icons */}
            <div className={styles.iconGrid}>
                <button
                    className={styles.desktopIcon}
                    onClick={handleInstallClick}
                    disabled={loading}
                >
                    <div className={styles.iconWrapper}>
                        {loading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                        ) : (
                            <Gamepad2 className="h-10 w-10 text-white" />
                        )}
                    </div>
                    <span className={styles.iconLabel}>Instalador_Juego.exe</span>
                </button>
            </div>

            {/* Taskbar */}
            <div className={styles.taskbar}>
                <div className={styles.startBtn}>
                    <div className={styles.windowsIcon}>
                        <div className={styles.windowsIconSquare}></div>
                        <div className={styles.windowsIconSquare}></div>
                        <div className={styles.windowsIconSquare}></div>
                        <div className={styles.windowsIconSquare}></div>
                    </div>
                </div>
                <div className={styles.clock}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={modalState === 'blocked'}
                onClose={closeModal}
                title="Amenaza Detectada"
                description="Se ha bloqueado la ejecución de este programa."
                variant="destructive"
            >
                <div className={styles.modalContent}>
                    <ShieldAlert className="h-16 w-16 text-danger" />
                    <div className={styles.modalText}>
                        <p className={cn(styles.modalTitle, "text-danger")}>Acceso Denegado</p>
                        <p className={styles.modalDescription}>
                            La política de seguridad de la organización impide la instalación de software no autorizado.
                            Este incidente ha sido reportado al administrador.
                        </p>
                    </div>
                    <Button variant="destructive" className={styles.modalButton} onClick={closeModal}>
                        Entendido
                    </Button>
                </div>
            </Modal>

            <Modal
                isOpen={modalState === 'success'}
                onClose={closeModal}
                title="Instalación Iniciada"
                variant="success"
            >
                <div className={styles.modalContent}>
                    <CheckCircle className="h-16 w-16 text-success" />
                    <div className={styles.modalText}>
                        <p className={cn(styles.modalTitle, "text-success")}>Verificado</p>
                        <p className={styles.modalDescription}>
                            El instalador ha sido analizado y es seguro.
                            La instalación continuará en breve.
                        </p>
                    </div>
                    <Button variant="default" className={cn(styles.modalButton, styles.successButton)} onClick={closeModal}>
                        Aceptar
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
