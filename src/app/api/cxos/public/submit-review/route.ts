import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';
import type { SentimentTag, SubmitReviewResponse, NextAction } from '@/types';

// Sentiment determination based on rating
function getSentiment(rating: number): SentimentTag {
    if (rating === 5) return 'promoter';
    if (rating === 4) return 'passive';
    return 'detractor';
}

// Get config value from database or use default
async function getConfig(supabase: ReturnType<typeof createServerClient>, key: string, defaultValue: number): Promise<number> {
    const { data } = await supabase
        .from('cxos_config')
        .select('value')
        .eq('key', key)
        .single();

    if (data?.value) {
        return data.value.n || data.value.months || data.value.hours || defaultValue;
    }
    return defaultValue;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, rating, nps, review_text, non_customer_meta, customer_name, customer_phone } = body;

        // Validation
        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        if (!review_text) {
            return NextResponse.json(
                { error: 'Review text is required' },
                { status: 400 }
            );
        }

        // Enforce 100 char minimum for ratings < 5
        if (rating < 5 && review_text.length < 100) {
            return NextResponse.json(
                { error: 'Reviews with ratings below 5 stars require at least 100 characters' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();
        const sentiment = getSentiment(rating);
        const isCustomer = !!token;
        let customerId: string | null = null;

        // If token provided, verify customer (mock for MVP)
        if (token) {
            customerId = token;
        }

        // Check 6-month eligibility (for both customers and guests with phone)
        // Use customerId OR customer_phone as identifier
        const eligibilityKey = customerId || customer_phone;

        if (eligibilityKey) {
            const { data: eligibility } = await supabase
                .from('review_eligibility_cache')
                .select('last_review_date, next_allowed_date')
                .eq('customer_id', eligibilityKey) // We reuse customer_id column for phone too
                .single();

            if (eligibility?.next_allowed_date) {
                const nextAllowed = new Date(eligibility.next_allowed_date);
                if (nextAllowed > new Date()) {
                    return NextResponse.json(
                        {
                            error: 'You have already shared feedback recently. We value your voice again soon ❤️',
                            next_allowed_date: eligibility.next_allowed_date,
                        },
                        { status: 403 }
                    );
                }
            }
        }

        // Insert review
        const { data: review, error: insertError } = await supabase
            .from('reviews')
            .insert({
                customer_id: customerId,
                is_non_customer: !isCustomer,
                rating,
                nps,
                review_text,
                sentiment,
                customer_name: customer_name || null,
                customer_phone: customer_phone || null,
                non_customer_meta: non_customer_meta || null,
            })
            .select()
            .single();

        if (insertError) {
            console.error('Insert error:', insertError);
            return NextResponse.json(
                { error: 'Failed to save review' },
                { status: 500 }
            );
        }

        // Update eligibility cache for customers AND guests
        const cacheKey = customerId || customer_phone;
        if (cacheKey) {
            const frequencyMonths = await getConfig(supabase, 'review_frequency_months', 6);
            const nextAllowed = new Date();
            nextAllowed.setMonth(nextAllowed.getMonth() + frequencyMonths);

            await supabase
                .from('review_eligibility_cache')
                .upsert({
                    customer_id: cacheKey, // Storing phone as ID for guests
                    last_review_date: new Date().toISOString(),
                    next_allowed_date: nextAllowed.toISOString(),
                });
        }

        // Build next_action based on routing logic
        const nextAction: NextAction = {
            type: 'THANK_YOU_ONLY',
        };

        // Get coupon discount percentage
        const discountPercent = await getConfig(supabase, 'coupon_discount_percent', 5);

        if (!isCustomer) {
            // Non-customer: just thank you
            nextAction.type = 'THANK_YOU_ONLY';
            nextAction.message = 'Thanks for your feedback!';
        } else if (rating === 5) {
            // Promoter: Google redirect + coupon
            nextAction.type = 'GOOGLE_REDIRECT';
            nextAction.google_review_url = process.env.GOOGLE_REVIEW_URL || 'https://g.page/r/CbzyDhZ0C2a7EBM/review';
            nextAction.clipboard_text = review_text;
            nextAction.coupon = {
                discount_percent: discountPercent,
                coupon_id: `CXOS-${review.id.slice(0, 8).toUpperCase()}`,
            };

            // In production, call Core API to generate coupon
            // POST /core/coupons/generate
        } else {
            // Detractor/Passive: Create support ticket + coupon
            const slaHours = await getConfig(supabase, 'sla_hours', 24);
            const slaDeadline = new Date();
            slaDeadline.setHours(slaDeadline.getHours() + slaHours);

            const { data: ticket, error: ticketError } = await supabase
                .from('support_tickets')
                .insert({
                    review_id: review.id,
                    customer_id: customerId,
                    status: 'open',
                    assigned_to: 'care',
                    sla_deadline: slaDeadline.toISOString(),
                })
                .select()
                .single();

            if (ticketError) {
                console.error('Ticket creation error:', ticketError);
            }

            nextAction.type = 'TICKET_CREATED';
            nextAction.ticket_id = ticket?.id;
            nextAction.coupon = {
                discount_percent: discountPercent,
                coupon_id: `CXOS-${review.id.slice(0, 8).toUpperCase()}`,
            };

            // In production, call Core API to create support ticket
            // POST /core/support/create-ticket
        }

        const response: SubmitReviewResponse = {
            review_id: review.id,
            is_customer: isCustomer,
            sentiment_tag: sentiment,
            next_action: nextAction,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Submit review error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
