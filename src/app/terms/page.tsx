'use client';

import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Privacy - RentBasket Feedback',
    description: 'Terms and Privacy Policy for RentBasket Feedback',
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-[var(--background-secondary)] font-sans">
            <div className="max-w-3xl mx-auto px-6 py-12">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <img src="/RentBasket-Logo.png" alt="RentBasket" className="w-10 h-10 rounded-xl object-contain" />
                        <span className="text-xl font-semibold text-[var(--foreground)]">RentBasket</span>
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-[var(--border-light)] p-8 md:p-12">
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-8 text-center">
                        RentBasket Feedback – Terms & Privacy
                    </h1>

                    <div className="space-y-8 text-[var(--foreground-secondary)] text-sm md:text-base leading-relaxed">

                        <section>
                            <h2 className="text-lg md:text-xl font-bold text-[var(--foreground)] mb-3">1. Purpose</h2>
                            <p>This feedback form helps RentBasket understand your experience and improve our products, delivery, and support.</p>
                            <p className="mt-2">Submitting feedback is voluntary and used only for service improvement and resolution.</p>
                        </section>

                        <section>
                            <h2 className="text-lg md:text-xl font-bold text-[var(--foreground)] mb-3">2. Who Can Submit</h2>
                            <ul className="list-disc pl-5 space-y-2 marker:text-[var(--foreground-muted)]">
                                <li>Both customers and non-customers may share feedback.</li>
                                <li>Only verified customers may be invited to post public reviews (e.g., Google).</li>
                                <li>Non-customer feedback is used internally for analysis only.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg md:text-xl font-bold text-[var(--foreground)] mb-3">3. Your Responsibility</h2>
                            <p>By submitting feedback, you confirm that:</p>
                            <ul className="list-disc pl-5 space-y-2 mt-2 marker:text-[var(--foreground-muted)]">
                                <li>Your input is honest and based on real experience.</li>
                                <li>You will not submit abusive, false, illegal, or misleading content.</li>
                            </ul>
                            <p className="mt-4 mb-2 font-medium text-[var(--foreground)]">RentBasket may store, review, and use feedback for:</p>
                            <ul className="list-disc pl-5 space-y-1 marker:text-[var(--foreground-muted)]">
                                <li>Customer support</li>
                                <li>Service improvement</li>
                                <li>Quality monitoring</li>
                                <li>Training & product enhancement</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg md:text-xl font-bold text-[var(--foreground)] mb-3">4. Privacy & Data Protection</h2>
                            <ul className="list-disc pl-5 space-y-2 marker:text-[var(--foreground-muted)]">
                                <li>Any personal details shared are handled securely and used only for support and improvement.</li>
                                <li>We do not sell personal data.</li>
                                <li>Feedback may be used in anonymous or aggregated form for internal insights or marketing learnings.</li>
                                <li>Data handling follows applicable Indian laws and reasonable security practices.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg md:text-xl font-bold text-[var(--foreground)] mb-3">5. Support & Resolution</h2>
                            <ul className="list-disc pl-5 space-y-2 marker:text-[var(--foreground-muted)]">
                                <li>If an issue is reported, our team may contact you to resolve it.</li>
                                <li>Typical response time is within 24–48 hours.</li>
                                <li>Submitting feedback does not guarantee refund or compensation, unless confirmed by RentBasket.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg md:text-xl font-bold text-[var(--foreground)] mb-3">6. Fair Use</h2>
                            <p>RentBasket may ignore or remove spam, fake, abusive, or irrelevant submissions, and restrict misuse of the system.</p>
                        </section>

                        <section>
                            <h2 className="text-lg md:text-xl font-bold text-[var(--foreground)] mb-3">7. Updates</h2>
                            <p>These terms may be updated anytime.</p>
                            <p className="mt-1">Continuing to use this form means you accept the latest version.</p>
                        </section>

                        <section>
                            <h2 className="text-lg md:text-xl font-bold text-[var(--foreground)] mb-3">8. Contact</h2>
                            <div className="p-4 bg-[var(--background-secondary)] rounded-xl border border-[var(--border-light)]">
                                <p className="font-bold text-[var(--foreground)] mb-1">RentBasket Support</p>
                                <p className="mb-1">📧 <a href="mailto:support@rentbasket.com" className="text-[var(--rb-red)] hover:underline font-medium">support@rentbasket.com</a></p>
                                <p className="text-[var(--foreground-muted)]">📍 Gurgaon, India</p>
                            </div>
                        </section>

                    </div>

                    <div className="mt-12 text-center pt-8 border-t border-[var(--border-light)]">
                        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[var(--foreground)] text-white font-medium hover:bg-opacity-90 transition-all">
                            Back to Home
                        </Link>
                    </div>
                </div>

                <footer className="mt-12 text-center text-sm text-[var(--foreground-muted)]">
                    &copy; {new Date().getFullYear()} RentBasket. All rights reserved.
                </footer>
            </div>
        </main>
    );
}
