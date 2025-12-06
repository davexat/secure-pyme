"use client";

import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar/Sidebar';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <main className={styles.main}>
                <div className={styles.container}>
                    {children}
                </div>
            </main>
        </div>
    );
};
