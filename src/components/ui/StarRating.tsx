"use client";

import { useState, useEffect } from "react";

interface StarRatingProps {
  value: number;
  onChange: (val: number) => void;
  max?: number;
}

export function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex space-x-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`w-6 h-6 cursor-pointer ${
            star <= (hovered || value) ? "text-yellow-400" : "text-gray-300"
          }`}
          fill={star <= (hovered || value) ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      ))}
    </div>
  );
}
