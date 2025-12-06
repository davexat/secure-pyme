"use client";

import React, { forwardRef, HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react';
import styles from './Table.module.css';
import { clsx } from 'clsx';

const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
    <div className={styles.tableContainer}>
        <table ref={ref} className={clsx(styles.table, className)} {...props} />
    </div>
));
Table.displayName = "Table";

const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
    <thead ref={ref} className={clsx(styles.header, className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
    <tbody ref={ref} className={clsx(styles.body, className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
    <tfoot ref={ref} className={clsx(styles.footer, className)} {...props} />
));
TableFooter.displayName = "TableFooter";

const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
    <tr ref={ref} className={clsx(styles.row, className)} {...props} />
));
TableRow.displayName = "TableRow";

const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
    <th ref={ref} className={clsx(styles.head, className)} {...props} />
));
TableHead.displayName = "TableHead";

const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
    <td ref={ref} className={clsx(styles.cell, className)} {...props} />
));
TableCell.displayName = "TableCell";

const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(({ className, ...props }, ref) => (
    <caption ref={ref} className={clsx(styles.caption, className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
};
