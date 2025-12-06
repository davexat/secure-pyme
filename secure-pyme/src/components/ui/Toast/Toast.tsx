"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import styles from './Toast.module.css';
import { clsx } from 'clsx';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
    id?: string;
    title?: string;
    description?: string;
    message?: string; // Legacy support or alias
    type?: ToastType;
    variant?: 'default' | 'destructive'; // shadcn compatibility
}

interface ToastContextValue {
    toast: (props: ToastProps) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const toast = useCallback((props: ToastProps) => {
        const id = Math.random().toString(36).substring(2, 9);
        // Map variant to type if type missing
        let type = props.type;
        if (!type) {
            if (props.variant === 'destructive') type = 'error';
            else type = 'info';
        }

        setToasts(prev => [...prev, { ...props, id, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000); // Auto dismiss after 3s
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className={styles.container}>
                {toasts.map(t => (
                    <div key={t.id} className={clsx(styles.toast, styles[t.type || 'info'])}>
                        <div className={styles.content}>
                            {t.title && <div className={styles.title}>{t.title}</div>}
                            {(t.description || t.message) && (
                                <div className={styles.message}>{t.description || t.message}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
