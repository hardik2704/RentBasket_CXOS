'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type LoginStep = 'phone' | 'otp';

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<LoginStep>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length === 10) {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/auth/generate-otp?mobile=${phone}`, {
                    method: 'GET',
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorMsg = 'Failed to send OTP';
                    try {
                        const errorData = JSON.parse(errorText);
                        errorMsg = errorData.message || errorData.error || errorMsg;
                    } catch {
                        // response wasn't JSON
                    }
                    throw new Error(errorMsg);
                }

                const data = await response.json();

                // Check if user is a registered customer
                if (data.isRegistered === false) {
                    // Non-customer: skip OTP, redirect to verify as non-customer
                    setIsLoading(false);
                    router.push('/verify?verified=false');
                    return;
                }
                setIsLoading(false);
                setStep('otp');
                setTimer(30);
            } catch (error: unknown) {
                console.error('OTP Send Error:', error);
                const msg = error instanceof Error ? error.message : 'Failed to send OTP';
                alert(msg);
                setIsLoading(false);
            }
        }
    };

    const handleVerifyOTP = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length === 4) {
            setIsLoading(true);
            try {
                // Call auth API via server-side proxy to avoid CORS
                const url = `/api/auth/verify-otp?mobile=${phone}&otp=${otpValue}`;
                const response = await fetch(url, {
                    method: 'POST',
                });

                const data = await response.json();

                if (response.ok && data.status === 'Success') {
                    if (data.isRegistered && data.user) {
                        // Store user data in session for verification page
                        sessionStorage.setItem('temp_cxos_user', JSON.stringify(data.user));
                        router.push('/verify?verified=true');
                    } else {
                        // Not a registered customer or verify failed
                        router.push('/verify?verified=false');
                    }
                } else {
                    throw new Error(data.message || 'Invalid OTP');
                }
            } catch (error) {
                console.error('Auth Error:', error);
                alert('Verification failed. Please check your OTP and try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }

        // Auto-submit if all digits are entered
        if (newOtp.every(digit => digit !== '') && index === 3) {
            // Optional: auto-submit logic if desired
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[var(--background-secondary)]">
            {/* Header */}
            <header className="pt-8 px-6 text-center">
                <Link href="/" className="inline-flex items-center gap-2 mb-2">
                    <img src="/RentBasket-Logo.png" alt="RentBasket" className="w-10 h-10 rounded-xl object-contain" />
                    <span className="text-xl font-semibold text-[var(--foreground)]">RentBasket</span>
                </Link>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-[var(--border-light)] fade-in">
                    {step === 'phone' ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                                    Customer Validation
                                </h1>
                                <p className="text-[var(--foreground-secondary)]">
                                    Enter your mobile number to get started
                                </p>
                            </div>

                            <form onSubmit={handleSendOTP} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[var(--foreground-secondary)] ml-1">
                                        Mobile Number
                                    </label>
                                    <div className="flex items-center w-full px-5 py-4 rounded-2xl border-2 border-[var(--border)] bg-white transition-all focus-within:border-[var(--rb-red)] focus-within:ring-4 focus-within:ring-[var(--rb-red-light)] shadow-sm">
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setPhone(val);
                                            }}
                                            placeholder="Enter 10-digit number"
                                            className="flex-1 bg-transparent border-none outline-none text-xl font-semibold tracking-[0.15em] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] placeholder:tracking-normal"
                                            autoFocus
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={phone.length < 10 || isLoading}
                                    className="btn-primary w-full text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <div className="spinner w-5 h-5 !border-white !border-t-transparent" />
                                    ) : (
                                        <>
                                            Generate OTP
                                            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center">
                                <button
                                    onClick={() => setStep('phone')}
                                    className="inline-flex items-center text-sm text-[var(--rb-red)] font-medium mb-4 hover:underline"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Change Number
                                </button>
                                <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                                    Verify OTP
                                </h1>
                                <p className="text-[var(--foreground-secondary)]">
                                    We've sent a code to <span className="font-semibold text-[var(--foreground)]">{phone.slice(0, 5)} {phone.slice(5)}</span>
                                </p>
                            </div>

                            <div className="flex gap-2 justify-center py-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-[var(--border)] rounded-xl focus:border-[var(--rb-red)] focus:ring-4 focus:ring-[var(--rb-red-light)] outline-none transition-all"
                                        maxLength={1}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => handleVerifyOTP()}
                                disabled={otp.some(digit => !digit) || isLoading}
                                className="btn-primary w-full text-lg py-4"
                            >
                                {isLoading ? (
                                    <div className="spinner w-5 h-5 !border-white !border-t-transparent" />
                                ) : (
                                    'Verify & Continue'
                                )}
                            </button>

                            <div className="text-center">
                                {timer > 0 ? (
                                    <p className="text-sm text-[var(--foreground-secondary)]">
                                        Resend code in <span className="font-medium text-[var(--rb-red)]">{timer}s</span>
                                    </p>
                                ) : (
                                    <button
                                        onClick={() => {
                                            // Reuse handleSendOTP logic but we need to pass a mock event or refactor handleSendOTP
                                            // Easier to just call the API here or refactor handleSendOTP to be callable without event
                                            const resendEvent = { preventDefault: () => { } } as React.FormEvent;
                                            handleSendOTP(resendEvent);
                                        }}
                                        className="text-sm text-[var(--rb-red)] font-bold hover:underline"
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <p className="mt-8 text-sm text-[var(--foreground-muted)] text-center max-w-xs">
                    By continuing, you verify that you are a registered customer of RentBasket.
                </p>
            </div>

            {/* Footer */}
            <footer className="py-6 px-6 text-center border-t border-[var(--border-light)]">
                <div className="flex justify-center gap-6 text-sm text-[var(--foreground-secondary)]">
                    <Link href="#" className="hover:text-[var(--rb-red)] transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-[var(--rb-red)] transition-colors">Terms</Link>
                </div>
            </footer>
        </main>
    );
}
