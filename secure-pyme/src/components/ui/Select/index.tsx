"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import styles from './Select.module.css';
import { clsx } from 'clsx';

interface SelectContextValue {
    value: string;
    onValueChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

export const Select = ({ children, value, onValueChange }: { children: React.ReactNode, value: string, onValueChange: (val: string) => void }) => {
    const [open, setOpen] = useState(false);
    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
            <div style={{ position: 'relative' }}>
                {children}
            </div>
        </SelectContext.Provider>
    );
};

export const SelectTrigger = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error("SelectTrigger used outside Select");

    return (
        <button
            className={clsx(styles.trigger, className)}
            onClick={() => context.setOpen(!context.open)}
            type="button"
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    );
};

export const SelectValue = ({ placeholder }: { placeholder: string }) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error("SelectValue used outside Select");

    // This simple implementation doesn't know the label for the value unless we pass it or store it. 
    // For now, we rely on the parent logic usually showing the value or we just show the raw value.
    // In a real robust Select, we'd need to map value to label.
    // Hack: We often rely on the 'children' of SelectItem to display. 
    // But since we can't easily access that here without Context holding labels...
    // We will display value if present, else placeholder.
    // Ideally we improve this to be richer.

    return <span>{context.value || placeholder}</span>;
}

export const SelectContent = ({ children }: { children: React.ReactNode }) => {
    const context = useContext(SelectContext);
    const ref = useRef<HTMLDivElement>(null);
    if (!context) throw new Error("SelectContent used outside Select");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                context.setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [context]);

    if (!context.open) return null;

    return (
        <div className={styles.content} ref={ref}>
            <div className={styles.viewport}>
                {children}
            </div>
        </div>
    );
};

export const SelectItem = ({ value, children }: { value: string, children: React.ReactNode }) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error("SelectItem used outside Select");

    const isSelected = context.value === value;

    return (
        <div
            className={styles.item}
            onClick={() => {
                context.onValueChange(value);
                context.setOpen(false);
            }}
            role="option"
            aria-selected={isSelected}
            tabIndex={0}
        >
            {isSelected && (
                <span className={styles.itemIndicator}>
                    <Check className="h-4 w-4" />
                </span>
            )}
            {children}
        </div>
    );
};
