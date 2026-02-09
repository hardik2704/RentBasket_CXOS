import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json(
                { eligible: true, reason: 'No token provided, treated as new user' }
            );
        }

        const supabase = createServerClient();

        // Check eligibility cache
        const { data: eligibility } = await supabase
            .from('review_eligibility_cache')
            .select('last_review_date, next_allowed_date')
            .eq('customer_id', token)
            .single();

        if (eligibility?.next_allowed_date) {
            const nextAllowed = new Date(eligibility.next_allowed_date);
            if (nextAllowed > new Date()) {
                return NextResponse.json({
                    eligible: false,
                    next_allowed_date: eligibility.next_allowed_date,
                    reason: 'You have already shared feedback recently. We value your voice again soon ❤️',
                });
            }
        }

        return NextResponse.json({
            eligible: true,
            reason: null,
        });
    } catch (error) {
        console.error('Check eligibility error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
