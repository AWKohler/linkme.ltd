import React from 'react';
import { cn } from '@/lib/utils';

interface GradientBarProps {
    gradientStops: { color: string; position: number }[];
    className?: string;
}

export function GradientBar({ gradientStops, className }: GradientBarProps) {
    const gradient = `linear-gradient(to right, ${gradientStops
        .map(({ color, position }) => `${color} ${position}%`)
        .join(', ')})`;

    return (
        <div
            className={cn('h-6 rounded-md', className)}
            style={{ background: gradient }}
        />
    );
}