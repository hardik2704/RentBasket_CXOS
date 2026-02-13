'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type VerificationState = 'loading' | 'verified' | 'non-customer';

interface CustomerInfo {
    customer_id: string;
    name?: string;
    email?: string;
    phone?: string;
    profile_pic?: string;
    eligible: boolean;
    next_allowed_date?: string;
}

export default function VerifyPage() {
    const router = useRouter();
    const [state, setState] = useState<VerificationState>('loading');
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');

    useEffect(() => {
        const checkVerification = async () => {

            // Add a small delay for better UX (loading state)
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const urlParams = new URLSearchParams(window.location.search);
            const verified = urlParams.get('verified');
            const token = urlParams.get('token');



            if (verified === 'true') {
                try {
                    const storedUser = sessionStorage.getItem('temp_cxos_user');

                    if (storedUser) {
                        const user = JSON.parse(storedUser);
                        setCustomerInfo({
                            customer_id: user.customer_mobile_number || 'unknown',
                            name: user.customer_name,
                            email: user.customer_email,
                            phone: user.customer_mobile_number,
                            profile_pic: user.customer_profile_pic,
                            eligible: true,
                        });
                        setState('verified');
                    } else {
                        // Fallback if session data missing but verified=true
                        setState('non-customer');
                    }
                } catch (e) {
                    console.error('Error parsing user data', e);
                    setState('non-customer');
                }
            } else if (token) {
                // Existing mock logic for backward compatibility
                setCustomerInfo({
                    customer_id: token,
                    name: 'Hardik Mahendru', // Updated mock name to match example
                    email: 'hardik@rentbasket.com',
                    phone: '+91 99584 48249',
                    profile_pic: 'https://ui-avatars.com/api/?name=Hardik+Mahendru&background=d72f26&color=fff',
                    eligible: true,
                });
                setState('verified');
            } else {
                setState('non-customer');
            }
        };

        checkVerification();
    }, []);

    const handleContinue = () => {
        // Store verification state in sessionStorage
        if (state === 'verified' && customerInfo) {
            sessionStorage.setItem('cxos_customer', JSON.stringify(customerInfo));
        } else {
            // Store guest details
            sessionStorage.setItem('cxos_customer', JSON.stringify({
                name: guestName,
                phone: guestPhone,
                eligible: true, // Assuming guest is eligible until checked by API
                is_guest: true
            }));
        }
        router.push('/review');
    };

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
                <div className="max-w-md w-full text-center">
                    {state === 'loading' && (
                        <div className="fade-in">
                            <div className="spinner mx-auto mb-6"></div>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                                Verifying...
                            </h2>
                            <p className="text-[var(--foreground-secondary)]">
                                Checking your RentBasket account
                            </p>
                        </div>
                    )}

                    {state === 'verified' && customerInfo && (
                        <div className="fade-in">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--success-bg)] text-[#065f46] font-medium mb-8">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Verified customer
                            </div>

                            {/* User Block */}
                            <div className="mb-8 p-6 bg-white rounded-3xl shadow-lg border border-[var(--border-light)] text-left flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[var(--rb-red-light)] flex-shrink-0">
                                    {customerInfo.profile_pic ? (
                                        <img src={customerInfo.profile_pic} alt={customerInfo.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[var(--rb-red)] font-bold text-xl">
                                            {customerInfo.name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-[var(--foreground)] truncate">
                                        {customerInfo.name}
                                    </h3>
                                    <p className="text-sm text-[var(--foreground-secondary)] truncate">
                                        {customerInfo.phone}
                                    </p>
                                    <p className="text-sm text-[var(--foreground-muted)] truncate">
                                        {customerInfo.email}
                                    </p>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                                Welcome back!
                            </h2>
                            <p className="text-[var(--foreground-secondary)] mb-8">
                                We&apos;re excited to hear your feedback about our services.
                            </p>

                            <button onClick={handleContinue} className="btn-primary text-lg w-full">
                                Start Feedback
                                <svg
                                    className="w-5 h-5 ml-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}

                    {state === 'non-customer' && (
                        <div className="fade-in">
                            {/* Info Icon */}
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--info-bg)] flex items-center justify-center">
                                <svg
                                    className="w-10 h-10 text-[var(--info)]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                    />
                                </svg>
                            </div>

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--background-secondary)] text-[var(--foreground-secondary)] font-medium mb-6">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Non-customer
                            </div>

                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                                Share your feedback
                            </h2>
                            <p className="text-[var(--foreground-secondary)] mb-8">
                                Please tell us a bit about yourself to proceed.
                            </p>

                            <div className="space-y-4 mb-6 text-left">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        className="input-field"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                                        Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={guestPhone}
                                        onChange={(e) => setGuestPhone(e.target.value)}
                                        className="input-field"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleContinue}
                                disabled={!guestName || !guestPhone}
                                className="btn-primary text-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue as Visitor
                                <svg
                                    className="w-5 h-5 ml-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
