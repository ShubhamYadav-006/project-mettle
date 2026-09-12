import React from 'react';

/**
 * 5-Axis Attribute Polygon Radar Chart (SVG Based)
 * Supports dynamic CSS variables for seamless Light / Dark mode rendering
 */
export default function RadarChart({ attributes }) {
  const stats = [
    { label: 'Mind', key: 'intellect', value: attributes?.intellect ?? 10, color: 'var(--attr-mind, #5B8DEF)' },
    { label: 'Will', key: 'discipline', value: attributes?.discipline ?? 10, color: 'var(--attr-will, #B5E34A)' },
    { label: 'Body', key: 'strength', value: attributes?.strength ?? 10, color: 'var(--attr-body, #3FA56F)' },
    { label: 'Craft', key: 'creativity', value: attributes?.creativity ?? 10, color: 'var(--attr-craft, #9B7AC7)' },
    { label: 'Habit', key: 'consistency', value: attributes?.consistency ?? 10, color: 'var(--attr-habit, #C99628)' },
  ];

  const size = 280;
  const center = size / 2;
  const radius = 90;
  const maxStatValue = Math.max(30, ...stats.map((s) => s.value));

  const totalAxes = stats.length;
  const angleStep = (Math.PI * 2) / totalAxes;

  // Concentric Rings
  const rings = [0.25, 0.5, 0.75, 1];

  const getCoordinates = (index, valueRatio) => {
    const angle = index * angleStep - Math.PI / 2;
    const x = center + radius * valueRatio * Math.cos(angle);
    const y = center + radius * valueRatio * Math.sin(angle);
    return { x, y };
  };

  // Generate Player Data Polygon Points
  const polygonPoints = stats
    .map((stat, i) => {
      const ratio = Math.min(1, Math.max(0.15, stat.value / maxStatValue));
      const { x, y } = getCoordinates(i, ratio);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="flex flex-col items-center justify-center p-2 select-none">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Concentric Grid Rings */}
        {rings.map((ring, idx) => {
          const points = stats
            .map((_, i) => {
              const { x, y } = getCoordinates(i, ring);
              return `${x},${y}`;
            })
            .join(' ');
          return (
            <polygon
              key={idx}
              points={points}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Lines */}
        {stats.map((_, i) => {
          const { x, y } = getCoordinates(i, 1);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="var(--border)"
              strokeWidth="1"
            />
          );
        })}

        {/* Active Attribute Polygon */}
        <polygon
          points={polygonPoints}
          fill="var(--accent-soft)"
          stroke="var(--accent)"
          strokeWidth="1.5"
          className="transition-all duration-300 ease-out"
        />

        {/* Vertex Dots & Labels */}
        {stats.map((stat, i) => {
          const ratio = Math.min(1, Math.max(0.15, stat.value / maxStatValue));
          const { x, y } = getCoordinates(i, ratio);
          const labelPos = getCoordinates(i, 1.25);

          return (
            <g key={stat.key}>
              {/* Vertex Dot */}
              <circle
                cx={x}
                cy={y}
                r="3.5"
                fill={stat.color}
                stroke="var(--bg-surface)"
                strokeWidth="1.5"
              />
              {/* Text Label */}
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--text-secondary)"
                fontSize="11"
                fontWeight="700"
                fontFamily="'Space Grotesk', sans-serif"
              >
                {stat.label} <tspan fill="var(--text-primary)">{stat.value}</tspan>
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
