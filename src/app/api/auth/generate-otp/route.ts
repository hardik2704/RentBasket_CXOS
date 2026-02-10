import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const mobile = searchParams.get('mobile');

        if (!mobile) {
            return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 });
        }

        const apiUrl = `https://testapi.rentbasket.com/generate-otp-rb-auth?mobile=${mobile}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization-Key': 'gyfgfvytfrdctyftyftfyiyftrdrtufc',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('OTP Proxy Error:', error);
        return NextResponse.json({ error: 'Failed to connect to OTP service' }, { status: 500 });
    }
}
