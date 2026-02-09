'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import type { Review, SupportTicket, AdminDashboardResponse } from '@/types';

type TabType = 'urgent' | 'all' | 'reviews';

export default function AdminDashboard() {
    const [data, setData] = useState<AdminDashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('urgent');
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [resolving, setResolving] = useState(false);

    const fetchDashboard = useCallback(async () => {
        try {
            const res = await fetch('/api/cxos/admin/dashboard', {
                headers: {
                    'x-admin-key': 'cxos-admin-secret-key-change-in-production',
                },
            });

            if (!res.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const json = await res.json();
            setData(json);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
        // Refresh every 30 seconds
        const interval = setInterval(fetchDashboard, 30000);
        return () => clearInterval(interval);
    }, [fetchDashboard]);

    const handleResolve = async () => {
        if (!selectedTicket || !resolutionNotes) return;

        setResolving(true);
        try {
            const res = await fetch(`/api/cxos/admin/tickets/${selectedTicket.id}/resolve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-key': 'cxos-admin-secret-key-change-in-production',
                },
                body: JSON.stringify({ resolution_notes: resolutionNotes }),
            });

            if (!res.ok) {
                throw new Error('Failed to resolve ticket');
            }

            setSelectedTicket(null);
            setResolutionNotes('');
            fetchDashboard();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resolve');
        } finally {
            setResolving(false);
        }
    };

    const getHoursLeft = (deadline: string) => {
        const hours = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60);
        return hours;
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const urgentTickets = useMemo(() => {
        return (data?.urgent_tickets || []).filter(t => t.status !== 'resolved');
    }, [data?.urgent_tickets]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-[var(--foreground-secondary)]">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-[var(--error-bg)] text-[var(--error)] p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard
                    label="Reviews Today"
                    value={data?.metrics.total_reviews || 0}
                    icon="📝"
                />
                <MetricCard
                    label="Avg Rating"
                    value={(data?.metrics.avg_rating || 0).toFixed(1)}
                    suffix="/ 5"
                    icon="⭐"
                />
                <MetricCard
                    label="Promoters"
                    value={`${(data?.metrics.promoters_pct || 0).toFixed(0)}%`}
                    icon="💚"
                    positive
                />
                <MetricCard
                    label="Detractors"
                    value={`${(data?.metrics.detractors_pct || 0).toFixed(0)}%`}
                    icon="🔴"
                    negative
                />
            </div>

            {/* SLA Alert */}
            {(data?.sla.at_risk_tickets || 0) > 0 && (
                <div className="bg-[var(--warning-bg)] border-l-4 border-[var(--warning)] p-4 rounded-r-lg mb-6 pulse-warning">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <p className="font-medium text-[#92400e]">
                                {data?.sla.at_risk_tickets} ticket(s) at SLA risk
                            </p>
                            <p className="text-sm text-[#92400e]/80">
                                Action needed within the next 4 hours
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Escalated Alert */}
            {(data?.sla.escalated_tickets || 0) > 0 && (
                <div className="bg-[var(--error-bg)] border-l-4 border-[var(--error)] p-4 rounded-r-lg mb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🚨</span>
                        <div>
                            <p className="font-medium text-[#991b1b]">
                                {data?.sla.escalated_tickets} ticket(s) escalated to Hardik
                            </p>
                            <p className="text-sm text-[#991b1b]/80">
                                SLA exceeded - immediate attention required
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-[var(--border-light)]">
                <div className="border-b border-[var(--border)]">
                    <div className="flex">
                        <TabButton
                            active={activeTab === 'urgent'}
                            onClick={() => setActiveTab('urgent')}
                            count={urgentTickets.length}
                        >
                            Urgent Tickets
                        </TabButton>
                        <TabButton
                            active={activeTab === 'all'}
                            onClick={() => setActiveTab('all')}
                            count={data?.sla.open_tickets || 0}
                        >
                            All Tickets
                        </TabButton>
                        <TabButton
                            active={activeTab === 'reviews'}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Recent Reviews
                        </TabButton>
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'urgent' && (
                        <TicketList
                            tickets={urgentTickets}
                            onSelect={setSelectedTicket}
                            getHoursLeft={getHoursLeft}
                            formatTime={formatTime}
                        />
                    )}

                    {activeTab === 'all' && (
                        <TicketList
                            tickets={data?.urgent_tickets || []}
                            onSelect={setSelectedTicket}
                            getHoursLeft={getHoursLeft}
                            formatTime={formatTime}
                        />
                    )}

                    {activeTab === 'reviews' && (
                        <ReviewList
                            reviews={data?.recent_reviews || []}
                            formatTime={formatTime}
                        />
                    )}
                </div>
            </div>

            {/* Ticket Detail Drawer */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
                    <div className="w-full max-w-md bg-white h-full overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold">Ticket Details</h2>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="p-2 hover:bg-[var(--background-secondary)] rounded-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Ticket Info */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wide">Ticket ID</label>
                                    <p className="font-mono text-sm">{selectedTicket.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wide">Status</label>
                                    <StatusBadge status={selectedTicket.status} />
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wide">Assigned To</label>
                                    <p className="capitalize">{selectedTicket.assigned_to}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wide">SLA Deadline</label>
                                    <p>{formatTime(selectedTicket.sla_deadline)}</p>
                                    {getHoursLeft(selectedTicket.sla_deadline) > 0 && (
                                        <p className="text-sm text-[var(--warning)]">
                                            {getHoursLeft(selectedTicket.sla_deadline).toFixed(1)}h remaining
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Resolution Form */}
                            {selectedTicket.status !== 'resolved' && (
                                <div className="border-t border-[var(--border)] pt-6">
                                    <label className="block text-sm font-medium mb-2">Resolution Notes</label>
                                    <textarea
                                        value={resolutionNotes}
                                        onChange={(e) => setResolutionNotes(e.target.value)}
                                        className="textarea-field"
                                        placeholder="Describe how this was resolved..."
                                        rows={4}
                                    />
                                    <button
                                        onClick={handleResolve}
                                        disabled={!resolutionNotes || resolving}
                                        className="btn-primary w-full mt-4"
                                    >
                                        {resolving ? 'Resolving...' : 'Mark Resolved'}
                                    </button>
                                </div>
                            )}

                            {selectedTicket.status === 'resolved' && selectedTicket.resolution_notes && (
                                <div className="border-t border-[var(--border)] pt-6">
                                    <label className="block text-sm font-medium mb-2">Resolution Notes</label>
                                    <p className="text-sm text-[var(--foreground-secondary)]">
                                        {selectedTicket.resolution_notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Components

function MetricCard({
    label,
    value,
    suffix,
    icon,
    positive,
    negative,
}: {
    label: string;
    value: string | number;
    suffix?: string;
    icon: string;
    positive?: boolean;
    negative?: boolean;
}) {
    return (
        <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{icon}</span>
            </div>
            <p className="text-sm text-[var(--foreground-secondary)] mb-1">{label}</p>
            <p className={`text-2xl font-bold ${positive ? 'text-[var(--success)]' : negative ? 'text-[var(--error)]' : 'text-[var(--foreground)]'}`}>
                {value}
                {suffix && <span className="text-base font-normal text-[var(--foreground-muted)]"> {suffix}</span>}
            </p>
        </div>
    );
}

function TabButton({
    children,
    active,
    onClick,
    count,
}: {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
    count?: number;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${active
                ? 'border-[var(--rb-red)] text-[var(--rb-red)]'
                : 'border-transparent text-[var(--foreground-secondary)] hover:text-[var(--foreground)]'
                }`}
        >
            {children}
            {count !== undefined && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${active ? 'bg-[var(--rb-red-light)] text-[var(--rb-red)]' : 'bg-[var(--background-secondary)]'
                    }`}>
                    {count}
                </span>
            )}
        </button>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        open: 'badge-warning',
        in_progress: 'badge-info',
        resolved: 'badge-success',
        escalated: 'badge-error',
    };

    return (
        <span className={`badge ${styles[status as keyof typeof styles] || 'badge-neutral'} capitalize`}>
            {status.replace('_', ' ')}
        </span>
    );
}

function TicketList({
    tickets,
    onSelect,
    getHoursLeft,
    formatTime,
}: {
    tickets: SupportTicket[];
    onSelect: (ticket: SupportTicket) => void;
    getHoursLeft: (deadline: string) => number;
    formatTime: (date: string) => string;
}) {
    if (tickets.length === 0) {
        return (
            <div className="text-center py-12 text-[var(--foreground-secondary)]">
                <p>No tickets to display</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tickets.map((ticket) => {
                const hoursLeft = getHoursLeft(ticket.sla_deadline);
                const isUrgent = hoursLeft <= 4 && hoursLeft > 0;
                const isOverdue = hoursLeft <= 0;

                return (
                    <div
                        key={ticket.id}
                        onClick={() => onSelect(ticket)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${isOverdue
                            ? 'border-[var(--error)] bg-[var(--error-bg)]'
                            : isUrgent
                                ? 'border-[var(--warning)] bg-[var(--warning-bg)]'
                                : 'border-[var(--border)] hover:border-[var(--rb-red)]'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-sm text-[var(--foreground-secondary)]">
                                {ticket.id.slice(0, 8).toUpperCase()}
                            </span>
                            <StatusBadge status={ticket.status} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--foreground-secondary)]">
                                Assigned: <span className="capitalize">{ticket.assigned_to}</span>
                            </span>
                            <span className={`font-medium ${isOverdue ? 'text-[var(--error)]' : isUrgent ? 'text-[var(--warning)]' : 'text-[var(--foreground-secondary)]'
                                }`}>
                                {isOverdue
                                    ? 'OVERDUE'
                                    : isUrgent
                                        ? `${hoursLeft.toFixed(1)}h left`
                                        : formatTime(ticket.sla_deadline)
                                }
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ReviewList({
    reviews,
    formatTime,
}: {
    reviews: Review[];
    formatTime: (date: string) => string;
}) {
    const [filterType, setFilterType] = useState<'all' | 'customer' | 'non-customer'>('all');
    const [filterRange, setFilterRange] = useState<'today' | '7d' | '30d'>('7d');
    const [filterSentiment, setFilterSentiment] = useState<string[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<Review[]>(reviews);
    const [loading, setLoading] = useState(false);

    // Fetch filtered reviews when filters change
    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    type: filterType === 'all' ? '' : filterType,
                    range: filterRange,
                    sentiment: filterSentiment.join(','),
                });

                const res = await fetch(`/api/cxos/admin/reviews?${queryParams}`, {
                    headers: { 'x-admin-key': 'cxos-admin-secret-key-change-in-production' }
                });

                if (res.ok) {
                    const data = await res.json();
                    setFilteredReviews(data.reviews || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [filterType, filterRange, filterSentiment]);

    // Update initial data
    useEffect(() => {
        setFilteredReviews(reviews);
    }, [reviews]);

    const toggleSentiment = (sem: string) => {
        setFilterSentiment(prev =>
            prev.includes(sem) ? prev.filter(s => s !== sem) : [...prev, sem]
        );
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 p-4 bg-[var(--background-secondary)] rounded-lg">
                {/* Type Filter */}
                <div className="flex bg-white rounded-md shadow-sm">
                    {(['all', 'customer', 'non-customer'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setFilterType(t)}
                            className={`px-3 py-1.5 text-xs font-medium capitalize first:rounded-l-md last:rounded-r-md border-r last:border-r-0 ${filterType === t
                                    ? 'bg-[var(--rb-red)] text-white'
                                    : 'text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]'
                                }`}
                        >
                            {t.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                {/* Range Filter */}
                <select
                    value={filterRange}
                    onChange={(e) => setFilterRange(e.target.value as any)}
                    className="px-3 py-1.5 text-xs bg-white border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--rb-red)]"
                >
                    <option value="today">Today</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                </select>

                {/* Sentiment Filter */}
                <div className="flex gap-2 items-center">
                    {['promoter', 'passive', 'detractor'].map(s => (
                        <button
                            key={s}
                            onClick={() => toggleSentiment(s)}
                            className={`px-3 py-1.5 text-xs border rounded-full capitalize transition-colors ${filterSentiment.includes(s)
                                    ? s === 'promoter' ? 'bg-green-100 border-green-500 text-green-700'
                                        : s === 'passive' ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                                            : 'bg-red-100 border-red-500 text-red-700'
                                    : 'bg-white border-[var(--border)] text-[var(--foreground-secondary)]'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-12"><div className="spinner mx-auto"></div></div>
            ) : filteredReviews.length === 0 ? (
                <div className="text-center py-12 text-[var(--foreground-secondary)]">No reviews match filters</div>
            ) : (
                <div className="space-y-4">
                    {filteredReviews.map((review) => (
                        <div key={review.id} className="p-5 rounded-lg border border-[var(--border)] hover:border-[var(--border-dark)] transition-colors bg-white">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <SentimentBadge sentiment={review.sentiment} />
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className={`w-4 h-4 ${star <= review.rating ? 'text-[var(--star-filled)]' : 'text-[var(--star-empty)]'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <span className="text-xs text-[var(--foreground-muted)]">
                                    {formatTime(review.created_at)}
                                </span>
                            </div>

                            <p className="text-sm text-[var(--foreground)] mb-4 leading-relaxed">
                                {review.review_text}
                            </p>

                            {/* Customer Details */}
                            <div className="flex items-center gap-4 text-xs pt-3 border-t border-[var(--border-light)]">
                                {review.is_non_customer ? (
                                    <span className="badge badge-neutral bg-gray-100 text-gray-500">Non-customer</span>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium text-[var(--foreground)] flex items-center gap-1">
                                            👤 {review.customer_name || 'Unknown'}
                                        </span>
                                        {review.customer_phone && (
                                            <span className="text-[var(--foreground-secondary)] flex items-center gap-1">
                                                📞 {review.customer_phone}
                                            </span>
                                        )}
                                        {review.customer_id && (
                                            <span className="font-mono text-[var(--foreground-muted)]">
                                                ID: {review.customer_id.length > 10 ? review.customer_id.slice(0, 8) + '...' : review.customer_id}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
    const styles = {
        promoter: 'badge-success',
        passive: 'badge-warning',
        detractor: 'badge-error',
        unknown: 'badge-neutral',
    };

    return (
        <span className={`badge ${styles[sentiment as keyof typeof styles] || 'badge-neutral'} text-xs capitalize`}>
            {sentiment}
        </span>
    );
}
