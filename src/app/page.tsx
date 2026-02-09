'use client';

import Link from 'next/link';

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[var(--background-secondary)]">
      {/* Header */}
      <header className="pt-8 px-6 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--rb-red)] flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <span className="text-xl font-semibold text-[var(--foreground)]">RentBasket</span>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="max-w-md w-full text-center fade-in">
          {/* Decorative Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[var(--rb-red-light)] to-white flex items-center justify-center shadow-lg">
              <svg
                className="w-12 h-12 text-[var(--rb-red)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
            </div>
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">
            Help us improve your comfort ✨
          </h1>
          <p className="text-lg text-[var(--foreground-secondary)] mb-8 leading-relaxed">
            It takes 30 seconds. Your feedback goes directly to our team.
          </p>

          {/* CTA Button */}
          <Link href="/verify" className="btn-primary text-lg">
            Continue
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
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>

          {/* Note */}
          <p className="mt-6 text-sm text-[var(--foreground-muted)]">
            If you&apos;re a RentBasket customer, you&apos;ll be asked to verify.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-6 text-center border-t border-[var(--border-light)]">
        <div className="flex justify-center gap-6 text-sm text-[var(--foreground-secondary)]">
          <a href="#" className="hover:text-[var(--rb-red)] transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-[var(--rb-red)] transition-colors">
            Terms
          </a>
        </div>
      </footer>
    </main>
  );
}
