'use client';

import { useState } from 'react';

interface MapDataPoint {
  country: string;
  city: string;
  region: string;
  count: number;
  coordinates?: [number, number];
  cities?: string[];
}

interface WorldMapProps {
  data: MapDataPoint[];
}

const WorldMap: React.FC<WorldMapProps> = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState<MapDataPoint | null>(null);

  // Convert lat/lng to SVG coordinates (simple projection)
  const projectCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  };

  // Aggregate data by coordinates to avoid overlapping pins
  const aggregatedData = data.reduce((acc, point) => {
    if (!point.coordinates) return acc;
    
    const key = `${point.coordinates[0]},${point.coordinates[1]}`;
    if (acc[key]) {
      acc[key].count = Number(acc[key].count) + Number(point.count);
      acc[key].cities.push(`${point.city}, ${point.region}`);
    } else {
      acc[key] = {
        ...point,
        count: Number(point.count),
        cities: [`${point.city}, ${point.region}`]
      };
    }
    return acc;
  }, {} as Record<string, MapDataPoint & { cities: string[] }>);

  const mapPoints = Object.values(aggregatedData);

  // Calculate pin size based on scan count (min 4px, max 20px)
  const getPinSize = (count: number) => {
    const maxCount = Math.max(...mapPoints.map(p => p.count));
    const minSize = 4;
    const maxSize = 20;
    const size = minSize + ((count / maxCount) * (maxSize - minSize));
    return Math.max(minSize, Math.min(maxSize, size));
  };

  return (
    <div className="relative w-full h-96 bg-blue-50 rounded-lg overflow-hidden">
      <svg
        viewBox="0 0 800 400"
        className="w-full h-full"
        style={{ backgroundColor: '#f0f9ff' }}
      >
        {/* Simple world map outline */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0e7ff" strokeWidth="0.5"/>
          </pattern>
        </defs>
        
        {/* Grid background */}
        <rect width="800" height="400" fill="url(#grid)" />
        
        {/* Simple continent shapes */}
        <g fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5">
          {/* North America */}
          <path d="M 50 80 L 180 70 L 200 120 L 180 180 L 120 190 L 80 160 L 50 120 Z" />
          {/* South America */}
          <path d="M 150 200 L 180 190 L 190 220 L 180 280 L 160 320 L 140 300 L 130 250 Z" />
          {/* Europe */}
          <path d="M 350 60 L 420 50 L 450 80 L 430 120 L 380 110 L 350 80 Z" />
          {/* Africa */}
          <path d="M 380 120 L 450 110 L 470 160 L 460 220 L 440 280 L 400 270 L 390 200 L 380 120 Z" />
          {/* Asia */}
          <path d="M 450 50 L 650 40 L 700 80 L 720 120 L 680 160 L 600 140 L 520 120 L 450 80 Z" />
          {/* Australia */}
          <path d="M 580 260 L 650 250 L 680 280 L 660 300 L 600 290 L 580 270 Z" />
        </g>

        {/* Scan location pins */}
        {mapPoints.map((point, index) => {
          if (!point.coordinates) return null;
          
          const { x, y } = projectCoordinates(point.coordinates[1], point.coordinates[0]);
          const pinSize = getPinSize(point.count);
          
          return (
            <g key={index}>
              {/* Pin shadow */}
              <circle
                cx={x + 1}
                cy={y + 1}
                r={pinSize / 2}
                fill="rgba(0,0,0,0.2)"
              />
              {/* Pin */}
              <circle
                cx={x}
                cy={y}
                r={pinSize / 2}
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="1"
                className="cursor-pointer hover:fill-red-600 transition-colors"
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* Pin center dot */}
              <circle
                cx={x}
                cy={y}
                r={1}
                fill="#ffffff"
                className="pointer-events-none"
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg border max-w-xs z-10">
          <div className="font-semibold">{hoveredPoint.country}</div>
          <div className="text-sm text-gray-600 mb-2">
            {hoveredPoint.cities ? hoveredPoint.cities.slice(0, 3).join(', ') : 
             `${hoveredPoint.city}, ${hoveredPoint.region}`}
            {hoveredPoint.cities && hoveredPoint.cities.length > 3 && 
             ` +${hoveredPoint.cities.length - 3} more`}
          </div>
          <div className="text-lg font-bold text-blue-600">
            {hoveredPoint.count} scans
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border">
        <div className="text-sm font-semibold mb-2">Scan Volume</div>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 bg-red-500 rounded-full"></div>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;