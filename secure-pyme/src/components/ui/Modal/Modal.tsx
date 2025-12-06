"use client";

import React, { ReactNode } from 'react';
import styles from './Modal.module.css';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: ReactNode;
    variant?: 'default' | 'destructive' | 'success';
}

export const Modal = ({ isOpen, onClose, title, description, children, variant = "default" }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={clsx(styles.content, styles[variant])}>
                <div className={styles.header}>
                    <div className="space-y-1">
                        {title && <h2 className={styles.title}>{title}</h2>}
                        {description && <p className={styles.description}>{description}</p>}
                    </div>
                    <button className={styles.close} onClick={onClose}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        </div>
    );
};
