import { useState } from 'react';
import { DNKS } from '../data/mockData';

interface Props {
  onSelect?: (dnkId: string) => void;
  selectedId?: string;
}

const CITY_POSITIONS: Record<string, { x: number; y: number }> = {
  'Ahmedabad': { x: 155, y: 260 },
  'Mumbai': { x: 140, y: 290 },
  'Delhi': { x: 195, y: 160 },
  'Kolkata': { x: 305, y: 260 },
  'Chennai': { x: 230, y: 360 },
  'Jaipur': { x: 175, y: 195 },
  'Bengaluru': { x: 210, y: 340 },
  'Hyderabad': { x: 210, y: 310 },
  'Lucknow': { x: 240, y: 200 },
  'Pune': { x: 155, y: 300 },
  'Kochi': { x: 200, y: 390 },
  'Varanasi': { x: 265, y: 210 },
  'Bhuj': { x: 120, y: 210 },
  'Surat': { x: 145, y: 275 },
  'Mysore': { x: 205, y: 345 },
  'Gandhinagar': { x: 158, y: 255 },
};

export default function IndiaMap({ onSelect, selectedId }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative">
      <svg viewBox="0 0 400 500" className="w-full h-auto">
        <path
          d="M160,80 L180,60 L220,50 L260,60 L290,80 L320,110 L330,150 L340,180 L330,220 L320,250 L340,280 L330,310 L310,340 L280,360 L250,380 L220,400 L200,420 L180,400 L160,380 L140,350 L120,320 L110,290 L100,260 L110,230 L120,200 L130,170 L140,140 L150,110 Z"
          fill="var(--color-soft-gray)"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
          opacity="0.3"
        />
        {DNKS.map((dnk) => {
          const pos = CITY_POSITIONS[dnk.district];
          if (!pos) return null;
          const isSelected = selectedId === dnk.id;
          const isHovered = hovered === dnk.id;
          return (
            <g
              key={dnk.id}
              onMouseEnter={() => setHovered(dnk.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect?.(dnk.id)}
              className="cursor-pointer"
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isSelected ? 8 : isHovered ? 7 : 5}
                fill={isSelected ? 'var(--color-brand-red)' : isHovered ? 'var(--color-accent-amber)' : 'var(--color-primary)'}
                stroke="white"
                strokeWidth="2"
              />
              {(isHovered || isSelected) && (
                <text
                  x={pos.x}
                  y={pos.y - 12}
                  textAnchor="middle"
                  className="text-[10px] font-semibold fill-gray-800"
                >
                  {dnk.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-2 left-2 text-xs text-gray-400">
        * DNK locations are approximate
      </div>
    </div>
  );
}
