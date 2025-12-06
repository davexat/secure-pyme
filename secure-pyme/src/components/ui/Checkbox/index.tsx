"use client";

import React, { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Checkbox.module.css';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, onCheckedChange, onChange, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
            onCheckedChange?.(e.target.checked);
        };

        return (
            <input
                type="checkbox"
                className={clsx(styles.checkbox, className)}
                ref={ref}
                onChange={handleChange}
                {...props}
            />
        );
    }
);
Checkbox.displayName = "Checkbox";
