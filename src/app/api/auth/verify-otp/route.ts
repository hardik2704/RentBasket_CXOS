import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const mobile = searchParams.get('mobile');
        const otp = searchParams.get('otp');

        if (!mobile || !otp) {
            return NextResponse.json(
                { error: 'Mobile number and OTP are required' },
                { status: 400 }
            );
        }

        const apiUrl = `https://testapi.rentbasket.com/rb-auth?mobile=${mobile}&otp=${otp}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization-Key': 'gyfgfvytfrdctyftyftfyiyftrdrtufc',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Auth Proxy Error:', error);
        return NextResponse.json(
            { error: 'Failed to connect to auth service' },
            { status: 500 }
        );
    }
}
