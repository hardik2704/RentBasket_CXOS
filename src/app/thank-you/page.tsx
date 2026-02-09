'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { SubmitReviewResponse } from '@/types';

export default function ThankYouPage() {
    const [result, setResult] = useState<SubmitReviewResponse | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem('cxos_result');
        if (stored) {
            try {
                setResult(JSON.parse(stored));
            } catch {
                // Handle parse error
            }
        }
    }, []);

    const coupon = result?.next_action?.coupon;
    const ticketId = result?.next_action?.ticket_id;

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
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--info-bg)] flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-[var(--info)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                            />
                        </svg>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">
                        Thank you — we&apos;re on it.
                    </h1>
                    <p className="text-lg text-[var(--foreground-secondary)] mb-8">
                        Your feedback has been received and our team will review it promptly.
                    </p>

                    {/* Ticket Card */}
                    {ticketId && (
                        <div className="ticket-card mb-6 text-left fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-5 h-5 text-[var(--info)]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[var(--foreground)] mb-1">
                                        Support Ticket Created
                                    </h3>
                                    <p className="text-sm text-[var(--foreground-secondary)]">
                                        Ticket ID: {ticketId.slice(0, 8).toUpperCase()}
                                    </p>
                                    <p className="text-sm text-[var(--foreground-secondary)] mt-1">
                                        <span className="font-medium text-[var(--info)]">SLA: 24 hours</span> — We&apos;ll respond within 24 hours
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Coupon Card */}
                    {coupon && (
                        <div className="coupon-card mb-8 fade-in" style={{ animationDelay: '0.3s' }}>
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

                    {/* CTA */}
                    <Link href="/" className="btn-primary inline-flex">
                        Done
                    </Link>
                </div>
            </div>
        </main>
    );
}
