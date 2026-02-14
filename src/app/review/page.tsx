'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StarRating } from '@/components/ui';

interface CustomerInfo {
    customer_id: string;
    name?: string;
    email?: string;
    phone?: string;
    eligible: boolean;
}

export default function ReviewPage() {
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [nps, setNps] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isCustomer, setIsCustomer] = useState(false);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const minChars = 100;
    const requiresMinChars = rating > 0 && rating < 5;
    const charCount = reviewText.length;
    const isValid = rating > 0 && nps > 0 && (!requiresMinChars || charCount >= minChars);

    useEffect(() => {
        // Check for customer info from verification
        const stored = sessionStorage.getItem('cxos_customer');
        if (stored && stored !== 'non-customer') {
            try {
                const info = JSON.parse(stored);
                setCustomerInfo(info);
                // Only verified customers have customer_id and are not guests
                setIsCustomer(!!info.customer_id && !info.is_guest);
            } catch {
                setIsCustomer(false);
            }
        }
    }, []);

    const handleSubmit = async () => {
        if (!isValid) return;

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/cxos/public/submit-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: isCustomer && customerInfo ? customerInfo.customer_id : null,
                    rating,
                    nps,
                    review_text: reviewText,
                    // Send name/phone from customerInfo (works for both Verified and Guest)
                    customer_name: customerInfo ? customerInfo.name : null,
                    customer_phone: customerInfo ? customerInfo.phone : null,
                    non_customer_meta: !isCustomer ? { name: null, phone: null, email: null } : null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit review');
            }

            // Store response for outcome page
            sessionStorage.setItem('cxos_result', JSON.stringify(data));
            sessionStorage.setItem('cxos_review_text', reviewText);

            // Route based on next_action
            if (data.next_action.type === 'GOOGLE_REDIRECT') {
                router.push('/awesome');
            } else if (data.next_action.type === 'TICKET_CREATED' || data.next_action.type === 'THANK_YOU_ONLY') {
                router.push('/thank-you');
            } else if (!data.is_customer) {
                router.push('/done');
            } else {
                router.push('/thank-you');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setIsSubmitting(false);
        }
    };

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
            <div className="flex-1 flex flex-col items-center px-6 py-8">
                <div className="max-w-lg w-full">
                    <div className="text-center mb-8 fade-in">
                        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                            Rate Your Experience
                        </h1>
                        <p className="text-[var(--foreground-secondary)]">
                            Your honest feedback helps us improve
                        </p>
                    </div>

                    {/* Rating Section */}
                    <div className="card p-6 mb-6 fade-in" style={{ animationDelay: '0.1s' }}>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-4 text-center">
                            How was your experience with RentBasket?
                        </label>
                        <StarRating value={rating} onChange={setRating} size="lg" />
                        {rating > 0 && (
                            <p className="text-center mt-3 text-sm font-medium text-[var(--foreground)]">
                                {rating === 5 && '🎉 Excellent!'}
                                {rating === 4 && '😊 Good'}
                                {rating === 3 && '😐 Average'}
                                {rating === 2 && '😕 Below Average'}
                                {rating === 1 && '😞 Poor'}
                            </p>
                        )}
                    </div>

                    {/* NPS Section (optional) */}
                    {/* Recommendation Section (formerly NPS) */}
                    <div className="card p-6 mb-6 fade-in" style={{ animationDelay: '0.2s' }}>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-4 text-center">
                            How likely are you to recommend RentBasket?
                        </label>
                        <div className="flex justify-center mb-2">
                            <StarRating value={nps} onChange={setNps} size="lg" />
                        </div>
                        <div className="flex justify-between px-8 text-xs text-[var(--foreground-muted)]">
                            <span>Not likely</span>
                            <span>Very likely</span>
                        </div>
                    </div>

                    {/* Review Text */}
                    <div className="card p-6 mb-6 fade-in" style={{ animationDelay: '0.3s' }}>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-4">
                            {rating === 5
                                ? 'Share what made your experience great (optional)'
                                : 'Tell us what we can improve'
                            }
                        </label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder={
                                rating < 5
                                    ? 'Please share details about your experience so we can address it...'
                                    : 'What did you love about RentBasket?'
                            }
                            className="textarea-field"
                            rows={4}
                        />

                        {/* Character Counter */}
                        {requiresMinChars && (
                            <div className={`char-counter ${charCount >= minChars ? 'success' : charCount > 0 ? 'error' : ''}`}>
                                {charCount}/{minChars} characters
                                {charCount < minChars && charCount > 0 && (
                                    <span className="ml-1">({minChars - charCount} more needed)</span>
                                )}
                            </div>
                        )}

                        {/* Helper Text */}
                        {requiresMinChars && charCount < minChars && (
                            <p className="text-sm text-[var(--foreground-secondary)] mt-2">
                                Please share at least {minChars} characters so we can act quickly.
                            </p>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-[var(--error-bg)] text-[var(--error)] text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!isValid || isSubmitting}
                        className="btn-primary w-full text-lg"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner !w-5 !h-5 !border-white !border-t-transparent"></span>
                                Submitting...
                            </>
                        ) : (
                            <>
                                Submit Feedback
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                                    />
                                </svg>
                            </>
                        )}
                    </button>

                    {/* Customer Badge */}
                    {isCustomer && (
                        <div className="text-center mt-6">
                            <span className="badge badge-success">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Verified Customer
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
