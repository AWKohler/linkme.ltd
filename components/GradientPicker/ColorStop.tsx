import React from 'react';
import { cn } from '@/lib/utils';

interface ColorStopProps {
    color: string;
    position: number;
    isSelected: boolean;
    onChange: (color: string) => void;
    onPositionChange: (position: number) => void;
    onSelect: () => void;
    onDelete: () => void;
}

export function ColorStop({
                              color,
                              position,
                              isSelected,
                              onChange,
                              onPositionChange,
                              onSelect,
                              onDelete,
                          }: ColorStopProps) {
    return (
        <div
            className={cn(
                'absolute -translate-x-1/2 cursor-pointer group',
                'transform -translate-y-1/2 top-1/2',
            )}
            style={{ left: `${position}%` }}
            onMouseDown={onSelect}
        >
            <div
                className={cn(
                    'w-4 h-4 rounded-full border-2 border-white shadow-md',
                    'transition-transform hover:scale-110',
                    isSelected && 'ring-2 ring-blue-500 scale-110',
                )}
                style={{ backgroundColor: color }}
            >
                <input
                    type="color"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
            </div>
            {isSelected && (
                <button
                    onClick={onDelete}
                    className="absolute -top-6 left-1/2 -translate-x-1/2
                   opacity-0 group-hover:opacity-100 transition-opacity
                   text-red-500 hover:text-red-600"
                >
                    ×
                </button>
            )}
        </div>
    );
}