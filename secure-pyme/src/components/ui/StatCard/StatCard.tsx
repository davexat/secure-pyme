import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import styles from './StatCard.module.css';

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'primary';
    className?: string;
}

export function StatCard({
    title,
    value,
    description,
    icon,
    variant,
    className
}: StatCardProps) {
    const variantClass = variant ? styles[`border${variant.charAt(0).toUpperCase() + variant.slice(1)}`] : '';
    const iconClass = variant ? styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`] : styles.iconDefault;

    return (
        <Card className={`${styles.card} ${variantClass} ${className || ''}`}>
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
                <div className={`${styles.icon} ${iconClass}`}>
                    {icon}
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.value}>{value}</div>
                <p className={styles.label}>{description}</p>
            </div>
        </Card>
    );
}
