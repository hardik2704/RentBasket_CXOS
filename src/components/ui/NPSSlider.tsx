'use client';

interface NPSSliderProps {
    value: number | null;
    onChange: (value: number) => void;
}

export function NPSSlider({ value, onChange }: NPSSliderProps) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center text-sm text-[var(--foreground-secondary)]">
                <span>Not likely</span>
                <span>Very likely</span>
            </div>
            <div className="flex gap-1 justify-center">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                        key={num}
                        type="button"
                        onClick={() => onChange(num)}
                        className={`w-8 h-10 rounded-lg border-[1.5px] text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--rb-red)] focus:ring-offset-1
              ${value === num
                                ? 'bg-[var(--rb-red)] text-white border-[var(--rb-red)]'
                                : 'bg-white border-[var(--border)] hover:border-[var(--rb-red)] hover:bg-[var(--rb-red-light)]'
                            }
            `}
                        aria-label={`NPS score ${num}`}
                    >
                        {num}
                    </button>
                ))}
            </div>
        </div>
    );
}
