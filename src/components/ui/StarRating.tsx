'use client';

import { useState } from 'react';

interface StarRatingProps {
    value: number;
    onChange: (value: number) => void;
    size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ value, onChange, size = 'lg' }: StarRatingProps) {
    const [hoverValue, setHoverValue] = useState(0);

    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    };

    return (
        <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`${sizes[size]} transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--rb-red)] focus:ring-offset-2 rounded-full`}
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHoverValue(star)}
                    onMouseLeave={() => setHoverValue(0)}
                    aria-label={`Rate ${star} stars`}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill={(hoverValue || value) >= star ? '#fbbf24' : 'none'}
                        stroke={(hoverValue || value) >= star ? '#fbbf24' : '#d1d5db'}
                        strokeWidth={2}
                        className="w-full h-full"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                    </svg>
                </button>
            ))}
        </div>
    );
}
