import { NextRequest, NextResponse } from 'next/server'
import { isLogged } from '@/codeur/scraper';

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    const remember_user_token = params.get("remember_user_token");

    if (remember_user_token) {
        const logged = await isLogged(remember_user_token);
        if (logged != false)
            return NextResponse.json({ logged: true, data: logged })
    }

    return NextResponse.json({ error: "missing_parameters" })
}