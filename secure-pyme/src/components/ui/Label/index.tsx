"use client";

import React, { LabelHTMLAttributes, forwardRef } from 'react';
import styles from './Label.module.css';
import { clsx } from 'clsx';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> { }

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={clsx(styles.label, className)}
                {...props}
            />
        );
    }
);
Label.displayName = "Label";
