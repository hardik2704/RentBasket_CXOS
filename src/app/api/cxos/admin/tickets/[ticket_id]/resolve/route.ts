import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

// Validate admin key
function validateAdminKey(request: NextRequest): boolean {
    const adminKey = request.headers.get('x-admin-key');
    return adminKey === process.env.CXOS_ADMIN_KEY;
}

interface RouteParams {
    params: Promise<{ ticket_id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    if (!validateAdminKey(request)) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const { ticket_id } = await params;
        const body = await request.json();
        const { resolution_notes } = body;

        if (!resolution_notes) {
            return NextResponse.json(
                { error: 'Resolution notes are required' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        const { data: ticket, error } = await supabase
            .from('support_tickets')
            .update({
                status: 'resolved',
                resolution_notes,
            })
            .eq('id', ticket_id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Ticket not found' },
                    { status: 404 }
                );
            }
            throw error;
        }

        return NextResponse.json(ticket);
    } catch (error) {
        console.error('Resolve ticket error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
