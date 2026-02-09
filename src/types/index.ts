// Sentiment tag based on rating
export type SentimentTag = 'promoter' | 'passive' | 'detractor' | 'unknown';

// Ticket status
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'escalated';

// Assignee
export type Assignee = 'care' | 'hardik';

// Review
export interface Review {
    id: string;
    customer_id: string | null;
    is_non_customer: boolean;
    rating: number;
    nps: number | null;
    review_text: string;
    sentiment: SentimentTag;
    customer_name?: string | null;
    customer_phone?: string | null;
    non_customer_meta?: NonCustomerMeta | null;
    created_at: string;
}

// Non-customer metadata
export interface NonCustomerMeta {
    name?: string;
    phone?: string;
    email?: string;
}

// Support Ticket
export interface SupportTicket {
    id: string;
    review_id: string;
    customer_id: string | null;
    status: TicketStatus;
    assigned_to: Assignee;
    sla_deadline: string;
    resolution_notes: string | null;
    created_at: string;
    updated_at: string;
}

// Submit Review Request
export interface SubmitReviewRequest {
    token?: string | null;
    rating: number;
    nps?: number | null;
    review_text: string;
    non_customer_meta?: NonCustomerMeta | null;
}

// Submit Review Response
export interface SubmitReviewResponse {
    review_id: string;
    is_customer: boolean;
    sentiment_tag: SentimentTag;
    next_action: NextAction;
}

// Next Action after review submission
export interface NextAction {
    type: 'GOOGLE_REDIRECT' | 'THANK_YOU_ONLY' | 'TICKET_CREATED' | 'NOT_ELIGIBLE';
    google_review_url?: string;
    clipboard_text?: string;
    coupon?: {
        discount_percent: number;
        coupon_id?: string;
    };
    ticket_id?: string;
    message?: string;
}

// Eligibility Response
export interface EligibilityResponse {
    eligible: boolean;
    next_allowed_date?: string;
    reason?: string;
}

// Admin Dashboard Response
export interface AdminDashboardResponse {
    metrics: {
        total_reviews: number;
        avg_rating: number;
        promoters_pct: number;
        detractors_pct: number;
    };
    sla: {
        open_tickets: number;
        at_risk_tickets: number;
        escalated_tickets: number;
    };
    recent_reviews: Review[];
    urgent_tickets: SupportTicket[];
}

// CXOS Config
export interface CXOSConfig {
    coupon_discount_percent: number;
    review_frequency_months: number;
    sla_hours: number;
}

// Customer identity from Core API
export interface CustomerIdentity {
    customer_id: string;
    name?: string;
    phone?: string;
    email?: string;
    is_verified: boolean;
}
