import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const isSelfHosted = process.env.SELFHOSTED_API === 'true';
    if (!isSelfHosted) {
        return NextResponse.json({ error: 'Server-side compilation is disabled' }, { status: 501 });
    }

    const apiUrl = process.env.SELFHOSTED_API_URL || process.env.SELFOHOSTED_API_URL;
    if (!apiUrl) {
         return NextResponse.json({ error: 'API URL is not configured' }, { status: 500 });
    }

    try {
        const { typstSource } = await req.json();
        
        if (!typstSource) {
            return NextResponse.json({ error: 'typstSource is required' }, { status: 400 });
        }

        console.log("Making a POST request to:s", apiUrl)
        const response = await fetch(`${apiUrl}/compile/source`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ source: typstSource })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Typst API error:', response.status, errorText);
            return NextResponse.json({ error: 'Compilation failed on server' }, { status: response.status });
        } else {
            console.log("HTTP POST request succeeded")
        }

        const pdfBuffer = await response.arrayBuffer();
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf'
            }
        });
    } catch (error) {
        console.error('Error in compile-pdf route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
