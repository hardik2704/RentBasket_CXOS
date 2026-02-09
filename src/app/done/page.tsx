'use client';

import Link from 'next/link';

export default function DonePage() {
    return (
        <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[var(--background-secondary)]">
            {/* Header */}
            <header className="pt-8 px-6 text-center">
                <div className="inline-flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[var(--rb-red)] flex items-center justify-center">
                        <span className="text-white font-bold text-lg">R</span>
                    </div>
                    <span className="text-xl font-semibold text-[var(--foreground)]">RentBasket</span>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
                <div className="max-w-md w-full text-center fade-in">
                    {/* Icon */}
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--success-bg)] flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-[var(--success)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                        </svg>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">
                        Thanks for your feedback!
                    </h1>
                    <p className="text-lg text-[var(--foreground-secondary)] mb-4">
                        We appreciate you taking the time to share your thoughts.
                    </p>

                    {/* Note */}
                    <div className="bg-[var(--background-secondary)] rounded-xl p-4 mb-8 text-left">
                        <p className="text-sm text-[var(--foreground-secondary)]">
                            <span className="font-medium text-[var(--foreground)]">Note:</span> Coupons and Google review redirect are only available for verified RentBasket customers.
                        </p>
                    </div>

                    {/* CTA */}
                    <Link href="/" className="btn-primary inline-flex">
                        Done
                    </Link>
                </div>
            </div>
        </main>
    );
}
