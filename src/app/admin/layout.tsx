import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'CXOS Admin | War Room',
    description: 'RentBasket Customer Experience Operating System - Admin Dashboard',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--background-secondary)]">
            {/* Admin Header */}
            <header className="bg-white border-b border-[var(--border)] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[var(--rb-red)] flex items-center justify-center">
                                <span className="text-white font-bold text-sm">R</span>
                            </div>
                            <div>
                                <span className="font-semibold text-[var(--foreground)]">CXOS</span>
                                <span className="text-xs text-[var(--foreground-muted)] ml-2">War Room</span>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></span>
                                <span className="text-[var(--foreground-secondary)]">Live</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
}
