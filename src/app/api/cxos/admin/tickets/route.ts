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
        const status = searchParams.get('status');
        const slaRisk = searchParams.get('sla_risk') === 'true';

        let query = supabase.from('support_tickets').select('*');

        if (status) {
            query = query.eq('status', status);
        }

        if (slaRisk) {
            // Get tickets nearing SLA deadline (within 4 hours)
            const fourHoursFromNow = new Date();
            fourHoursFromNow.setHours(fourHoursFromNow.getHours() + 4);
            query = query
                .in('status', ['open', 'in_progress'])
                .lte('sla_deadline', fourHoursFromNow.toISOString());
        }

        query = query.order('sla_deadline', { ascending: true });

        const { data: tickets, error } = await query;

        if (error) {
            throw error;
        }

        return NextResponse.json({ tickets: tickets || [] });
    } catch (error) {
        console.error('Tickets error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
