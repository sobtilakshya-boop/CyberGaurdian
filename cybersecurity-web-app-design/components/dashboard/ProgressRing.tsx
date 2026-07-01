import React from 'react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function ProgressRing({ percentage = 0, size = 60, strokeWidth = 4, color = '#3b82f6' }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        className="text-gray-200"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-300"
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dy="0.3em"
        className="text-xs font-semibold transform rotate-90"
        style={{ fontSize: size * 0.25 }}
        fill="currentColor"
      >
        {Math.round(percentage)}%
      </text>
    </svg>
  );
}
