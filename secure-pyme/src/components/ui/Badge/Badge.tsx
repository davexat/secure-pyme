"use client";

import React from 'react';
import styles from './Badge.module.css';
import { clsx } from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' |
    'success' | 'warning' | 'danger' |
    'subtleSuccess' | 'subtleWarning' | 'subtleDanger' | 'subtlePrimary';
}

export const Badge = ({ className, variant = "default", ...props }: BadgeProps) => {
    return (
        <div className={clsx(styles.badge, styles[variant], className)} {...props} />
    );
};
