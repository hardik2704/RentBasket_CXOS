import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

// Validate admin key
function validateAdminKey(request: NextRequest): boolean {
    const adminKey = request.headers.get('x-admin-key');
    return adminKey === process.env.CXOS_ADMIN_KEY;
}

export async function GET(request: NextRequest) {
    if (!validateAdminKey(request)) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const supabase = createServerClient();
        const searchParams = request.nextUrl.searchParams;
        const fromDate = searchParams.get('from');
        const toDate = searchParams.get('to');

        // Get metrics (last 7 days by default)
        const { data: metrics } = await supabase
            .from('v_metrics_7d')
            .select('*')
            .single();

        // Get SLA stats
        const { data: openTickets } = await supabase
            .from('support_tickets')
            .select('id', { count: 'exact' })
            .in('status', ['open', 'in_progress']);

        const { data: atRiskTickets } = await supabase
            .from('v_sla_risk_tickets')
            .select('id', { count: 'exact' });

        const { data: escalatedTickets } = await supabase
            .from('support_tickets')
            .select('id', { count: 'exact' })
            .eq('status', 'escalated');

        // Get recent reviews
        let reviewsQuery = supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (fromDate) {
            reviewsQuery = reviewsQuery.gte('created_at', fromDate);
        }
        if (toDate) {
            reviewsQuery = reviewsQuery.lte('created_at', toDate);
        }

        const { data: recentReviews } = await reviewsQuery;

        // Get urgent tickets (at risk or escalated)
        const { data: urgentTickets } = await supabase
            .from('support_tickets')
            .select('*')
            .in('status', ['open', 'in_progress', 'escalated'])
            .order('sla_deadline', { ascending: true })
            .limit(10);

        return NextResponse.json({
            metrics: {
                total_reviews: metrics?.total_reviews || 0,
                avg_rating: metrics?.avg_rating || 0,
                promoters_pct: metrics?.promoters_pct || 0,
                detractors_pct: metrics?.detractors_pct || 0,
            },
            sla: {
                open_tickets: openTickets?.length || 0,
                at_risk_tickets: atRiskTickets?.length || 0,
                escalated_tickets: escalatedTickets?.length || 0,
            },
            recent_reviews: recentReviews || [],
            urgent_tickets: urgentTickets || [],
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
