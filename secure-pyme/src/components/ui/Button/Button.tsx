"use client";

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import styles from './Button.module.css';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'defaultSize' | 'sm' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    className,
    variant = 'default',
    size = 'defaultSize',
    isLoading,
    disabled,
    type = "button",
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            type={type}
            className={clsx(
                styles.button,
                styles[variant],
                styles[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = "Button";
