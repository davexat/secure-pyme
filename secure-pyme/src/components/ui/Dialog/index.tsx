"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './Dialog.module.css';
import { clsx } from 'clsx';
import { createPortal } from 'react-dom';

interface DialogContextValue {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export const Dialog = ({ children, open, onOpenChange }: { children: React.ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

    // Use controlled state if provided, otherwise local state
    const isOpen = open !== undefined ? open : uncontrolledOpen;
    const setIsOpen = onOpenChange || setUncontrolledOpen;

    return (
        <DialogContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </DialogContext.Provider>
    );
};

export const DialogTrigger = ({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) => {
    const context = useContext(DialogContext);
    if (!context) throw new Error("DialogTrigger used outside Dialog");

    // Clone child to attach onClick if asChild, otherwise wrap in button (simplified for now)
    return (
        <div onClick={() => context.setIsOpen(true)} style={{ display: 'inline-block' }}>
            {children}
        </div>
    );
};

export const DialogContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const context = useContext(DialogContext);
    if (!context) throw new Error("DialogContent used outside Dialog");

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!context.isOpen || !mounted) return null;

    return createPortal(
        <div className={styles.overlay} onClick={(e) => {
            if (e.target === e.currentTarget) context.setIsOpen(false);
        }}>
            <div className={clsx(styles.content, className)}>
                <button className={styles.closeButton} onClick={() => context.setIsOpen(false)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
};

export const DialogHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <div className={clsx(styles.header, className)}>{children}</div>;
};

export const DialogTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <h2 className={clsx(styles.title, className)}>{children}</h2>;
};

export const DialogDescription = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <p className={clsx(styles.description, className)}>{children}</p>;
};
