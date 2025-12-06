"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface NavLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    activeClassName?: string;
}

export const NavLink = ({ href, children, className, activeClassName }: NavLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={clsx(className, isActive && activeClassName)}
        >
            {children}
        </Link>
    );
};
