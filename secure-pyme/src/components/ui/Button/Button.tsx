import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import styles from './Button.module.css';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    className,
    variant = 'default',
    size = 'default',
    isLoading,
    disabled,
    type = "button",
    ...props
}, ref) => {
    const sizeClass = size === 'default' ? styles.defaultSize : styles[size];

    return (
        <button
            ref={ref}
            type={type}
            className={clsx(
                styles.button,
                styles[variant],
                sizeClass,
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className={styles.spinner} />}
            {children}
        </button>
    );
});

Button.displayName = "Button";
