"use client";

import React, { forwardRef } from 'react';
import styles from './Progress.module.css';
import { clsx } from 'clsx';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value, ...props }, ref) => {
        const percentage = value != null ? Math.min(100, Math.max(0, value)) : 0;
        return (
            <div
                ref={ref}
                className={clsx(styles.root, className)}
                {...props}
            >
                <div
                    className={styles.indicator}
                    style={{ transform: `translateX(-${100 - percentage}%)` }}
                />
            </div>
        );
    }
);
Progress.displayName = "Progress";
