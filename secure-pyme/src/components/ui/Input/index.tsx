import React, { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> { }

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={clsx(styles.input, className)}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";
