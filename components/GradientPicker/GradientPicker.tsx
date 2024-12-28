import React, { useState, useCallback } from 'react';
import { ColorStop } from './ColorStop';
import { GradientBar } from './GradientBar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export interface GradientStop {
    color: string;
    position: number;
}

interface GradientPickerProps {
    stops: GradientStop[];
    onChange: (stops: GradientStop[]) => void;
    className?: string;
}

export function GradientPicker({ stops, onChange, className }: GradientPickerProps) {
    const [selectedStop, setSelectedStop] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleAddStop = useCallback(() => {
        if (stops.length >= 5) return; // Limit to 5 stops
        const newStop = {
            color: '#000000',
            position: 50,
        };
        onChange([...stops, newStop]);
        setSelectedStop(stops.length);
    }, [stops, onChange]);

    const handleStopChange = useCallback(
        (index: number, changes: Partial<GradientStop>) => {
            const newStops = stops.map((stop, i) =>
                i === index ? { ...stop, ...changes } : stop
            );
            onChange(newStops);
        },
        [stops, onChange]
    );

    const handleDeleteStop = useCallback(
        (index: number) => {
            if (stops.length <= 2) return; // Maintain minimum 2 stops
            const newStops = stops.filter((_, i) => i !== index);
            onChange(newStops);
            setSelectedStop(null);
        },
        [stops, onChange]
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!isDragging || selectedStop === null) return;

            const rect = e.currentTarget.getBoundingClientRect();
            const position = Math.max(
                0,
                Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
            );

            handleStopChange(selectedStop, { position });
        },
        [isDragging, selectedStop, handleStopChange]
    );

    return (
        <div className={className}>
            <div
                className="relative h-8 mb-4"
                onMouseMove={handleMouseMove}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
            >
                <GradientBar gradientStops={stops} className="absolute inset-0" />

                {stops.map((stop, index) => (
                    <ColorStop
                        key={index}
                        color={stop.color}
                        position={stop.position}
                        isSelected={selectedStop === index}
                        onChange={(color) => handleStopChange(index, { color })}
                        onPositionChange={(position) => handleStopChange(index, { position })}
                        onSelect={() => {
                            setSelectedStop(index);
                            setIsDragging(true);
                        }}
                        onDelete={() => handleDeleteStop(index)}
                    />
                ))}
            </div>

            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddStop}
                    disabled={stops.length >= 5}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Color Stop
                </Button>
                {selectedStop !== null && (
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            className="w-20 px-2 py-1 border rounded"
                            value={Math.round(stops[selectedStop].position)}
                            onChange={(e) =>
                                handleStopChange(selectedStop, {
                                    position: Math.max(0, Math.min(100, Number(e.target.value))),
                                })
                            }
                            min="0"
                            max="100"
                        />
                        <span className="text-sm text-gray-500">%</span>
                    </div>
                )}
            </div>
        </div>
    );
}