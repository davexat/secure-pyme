"use client";

import React, { forwardRef } from 'react';

import styles from './Switch.module.css';
import { clsx } from 'clsx';

// Since we don't have radix installed, we simulate the behavior for generic usage 
// OR simpler: just implement a clean button. 
// However, the instructions imply using standard simple HTML if external libs are not requested.
// But to match the behavior "checked/onCheckedChange", I'll build a controlled button.

interface SwitchProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    id?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(({
    checked = false,
    onCheckedChange,
    disabled,
    className,
    id
}, ref) => {
    const handleClick = () => {
        if (!disabled && onCheckedChange) {
            onCheckedChange(!checked);
        }
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            data-state={checked ? 'checked' : 'unchecked'}
            disabled={disabled}
            className={clsx(styles.root, className)}
            onClick={handleClick}
            ref={ref}
            id={id}
        >
            <span className={styles.thumb} data-state={checked ? 'checked' : 'unchecked'} />
        </button>
    );
});

Switch.displayName = "Switch";
