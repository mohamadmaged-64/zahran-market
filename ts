import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (req.nextUrl.pathname.startsWith('/admin') && !session && req.nextUrl.pathname !== '/admin/login') {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return res;
}

// هنا بنقول للحارس: راقب الروابط اللي بتبدأ بـ /admin فقط
export const config = {
  matcher: ['/admin/:path*'],
};
