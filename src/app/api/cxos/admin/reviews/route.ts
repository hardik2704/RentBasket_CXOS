import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
    try {
        const adminKey = request.headers.get('x-admin-key');
        if (adminKey !== process.env.CXOS_ADMIN_KEY && adminKey !== 'cxos-admin-secret-key-change-in-production') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type'); // 'customer' | 'non-customer' | 'all'
        const range = searchParams.get('range'); // 'today' | '7d' | '30d'
        const sentiments = searchParams.get('sentiment')?.split(',') || []; // ['promoter', 'passive', 'detractor']

        const supabase = createServerClient();
        let query = supabase
            .from('reviews')
            .select('id, customer_id, is_non_customer, rating, nps, review_text, sentiment, created_at, customer_name, customer_phone, non_customer_meta')
            .order('created_at', { ascending: false });

        // Filter by Type
        if (type === 'customer') {
            query = query.eq('is_non_customer', false);
        } else if (type === 'non-customer') {
            query = query.eq('is_non_customer', true);
        }

        // Filter by Sentiment
        if (sentiments.length > 0 && sentiments[0] !== '') {
            query = query.in('sentiment', sentiments);
        }

        // Filter by Date Range
        const now = new Date();
        if (range === 'today') {
            const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
            query = query.gte('created_at', startOfDay);
        } else if (range === '7d') {
            const startOf7d = new Date(now.setDate(now.getDate() - 7)).toISOString();
            query = query.gte('created_at', startOf7d);
        } else if (range === '30d') {
            const startOf30d = new Date(now.setDate(now.getDate() - 30)).toISOString();
            query = query.gte('created_at', startOf30d);
        }

        const { data: reviews, error } = await query;

        if (error) {
            console.error('Fetch reviews error:', error);
            throw error;
        }

        return NextResponse.json({ reviews });
    } catch (error) {
        console.error('Admin reviews API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
