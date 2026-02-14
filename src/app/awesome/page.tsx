'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { SubmitReviewResponse } from '@/types';

export default function AwesomePage() {
    const [result, setResult] = useState<SubmitReviewResponse | null>(null);
    const [reviewText, setReviewText] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const storedResult = sessionStorage.getItem('cxos_result');
        const storedText = sessionStorage.getItem('cxos_review_text');

        if (storedResult) {
            try {
                setResult(JSON.parse(storedResult));
            } catch {
                // Handle parse error
            }
        }

        if (storedText) {
            setReviewText(storedText);
            // Auto-copy on mount
            navigator.clipboard.writeText(storedText).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
            });
        }
    }, []);

    const handleCopy = async () => {
        const textToCopy = result?.next_action?.clipboard_text || reviewText;
        if (textToCopy) {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    const googleUrl = result?.next_action?.google_review_url || process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || 'https://g.page/r/CbzyDhZ0C2a7EBM/review';
    const coupon = result?.next_action?.coupon;

    return (
        <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[var(--background-secondary)]">
            {/* Header */}
            <header className="pt-8 px-6 text-center">
                <div className="inline-flex items-center gap-2">
                    <img src="/RentBasket-Logo.png" alt="RentBasket" className="w-10 h-10 rounded-xl object-contain" />
                    <span className="text-xl font-semibold text-[var(--foreground)]">RentBasket</span>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
                <div className="max-w-md w-full text-center fade-in">
                    {/* Celebration Icon */}
                    <div className="text-6xl mb-6 animate-bounce">🎉</div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">
                        You made our day! ❤️
                    </h1>
                    <p className="text-lg text-[var(--foreground-secondary)] mb-8">
                        Thank you for your amazing feedback!
                    </p>

                    {/* Clipboard Card */}
                    <div className="card p-6 mb-6 text-left fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-[var(--success)]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                                    />
                                </svg>
                                <span className="font-medium text-[var(--foreground)]">
                                    {copied ? 'Copied!' : 'Review text copied'}
                                </span>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="text-sm text-[var(--rb-red)] font-medium hover:underline"
                            >
                                Copy again
                            </button>
                        </div>
                        <div className="bg-[var(--background-secondary)] rounded-lg p-3 text-sm text-[var(--foreground-secondary)] max-h-24 overflow-y-auto">
                            {reviewText || 'Your review text will appear here'}
                        </div>
                    </div>

                    {/* Google CTA */}
                    <a
                        href={googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full text-lg mb-4"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Post on Google
                    </a>

                    <p className="text-sm text-[var(--foreground-secondary)] mb-6">
                        Paste the copied text on Google Reviews to save time.
                    </p>

                    {/* Coupon Card */}
                    {coupon && (
                        <div className="coupon-card mb-6 fade-in" style={{ animationDelay: '0.3s' }}>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <svg className="w-6 h-6 text-[#92400e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                                <span className="text-sm font-medium text-[#92400e]">Reward Unlocked!</span>
                            </div>
                            <p className="coupon-code">{coupon.discount_percent}% OFF</p>
                            <p className="text-sm text-[#92400e] mt-1">Your next month&apos;s subscription</p>
                        </div>
                    )}

                    {/* Skip */}
                    <Link href="/" className="btn-secondary inline-flex">
                        Skip
                    </Link>
                </div>
            </div>
        </main>
    );
}
