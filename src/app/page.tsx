'use client';

import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="landing-page min-h-screen flex items-center justify-center p-5 font-sans">
      <main className="w-full max-w-[420px]">
        {/* Header */}
        <div className="flex items-center justify-center gap-2.5 mb-[18px]">
          <img src="/RentBasket-Logo.png" alt="RentBasket" className="w-[42px] h-[42px] rounded-xl object-contain" />
          <div className="font-extrabold tracking-[-0.02em] text-[20px]">
            RentBasket
          </div>
        </div>

        {/* Main Panel */}
        <section className="bg-white border border-[rgba(15,23,42,.06)] rounded-[24px] p-[22px] shadow-[0_10px_30px_rgba(2,6,23,.06)]">


          {/* Hero Text */}
          <h1 className="m-0 text-center text-[28px] leading-[1.15] tracking-[-0.03em] font-bold">
            Help us improve your comfort
          </h1>
          <p className="my-[10px] mb-[18px] text-center text-[var(--foreground-secondary)] text-[15px] leading-[1.5]">
            It takes 30 seconds. Your feedback goes directly to our team.
          </p>

          {/* Steps */}
          <ul className="grid gap-[10px] m-0 mb-[18px] p-0 list-none">
            <li className="landing-step flex gap-[10px] items-start p-[10px_12px] rounded-[16px]">
              <div className="landing-badge w-[26px] h-[26px] rounded-[8px] grid place-items-center font-extrabold flex-none mt-[1px] text-[14px]">
                1
              </div>
              <div>
                <b className="block text-[14px] mb-[2px]">Rate your experience</b>
                <span className="block text-[var(--foreground-secondary)] text-[13px] leading-[1.35]">Quick 1–5 rating to understand how we did.</span>
              </div>
            </li>
            <li className="landing-step flex gap-[10px] items-start p-[10px_12px] rounded-[16px]">
              <div className="landing-badge w-[26px] h-[26px] rounded-[8px] grid place-items-center font-extrabold flex-none mt-[1px] text-[14px]">
                2
              </div>
              <div>
                <b className="block text-[14px] mb-[2px]">Tell us what happened</b>
                <span className="block text-[var(--foreground-secondary)] text-[13px] leading-[1.35]">Share what went well and what we should fix.</span>
              </div>
            </li>
          </ul>

          {/* CTA */}
          <Link href="/login" className="landing-btn w-full h-[54px] rounded-full text-white text-[16px] font-extrabold tracking-[-0.01em] flex items-center justify-center gap-[10px] cursor-pointer outline-none transition-all no-underline">
            Continue <span aria-hidden="true">→</span>
          </Link>
          <p className="mt-[10px] text-center text-[var(--foreground-secondary)] text-[12.5px]">
            No login needed unless you&apos;re a customer.
          </p>

          {/* Footer Links */}
          <div className="mt-[14px] flex justify-between gap-[12px]">
            <Link href="https://wa.me/919958096702" target="_blank" rel="noopener noreferrer" className="text-[var(--foreground-secondary)] no-underline text-[12.5px] hover:text-[var(--foreground)]">
              Talk to support
            </Link>
            <Link href="/terms" className="text-[var(--foreground-secondary)] no-underline text-[12.5px] hover:text-[var(--foreground)]">
              Terms
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}
