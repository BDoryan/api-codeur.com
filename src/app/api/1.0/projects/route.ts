import { NextRequest, NextResponse } from 'next/server'
import { getProjects, isLogged } from '@/codeur/scraper';

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    const remember_user_token = params.get("remember_user_token");
    const category: any = params.get("category");
    const section: any = params.get("section");

    if (remember_user_token) {
        const projects = await getProjects(remember_user_token, category == "" ? undefined : category, section == "" ? undefined : section);
        return NextResponse.json({ projects })
    }

    return NextResponse.json({ error: "missing_parameters" })
}