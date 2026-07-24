import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session Supabase
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith('/login');

  // ── [C-02] Bảo vệ /profile và /episode — cần đăng nhập Supabase ────────
  if (!user && !isAuthPage && (
    pathname.startsWith('/profile') ||
    pathname.startsWith('/episode')
  )) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // ── [C-02] Bảo vệ /admin/* — cần admin_token cookie ────────────────────
  // Lưu ý: dùng ADMIN_SECRET_CODE (server-only) thay vì NEXT_PUBLIC_ADMIN_CODE
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminToken   = request.cookies.get('admin_token')?.value;
    const expectedCode = process.env.ADMIN_SECRET_CODE || process.env.NEXT_PUBLIC_ADMIN_CODE;

    if (!adminToken || adminToken !== expectedCode) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Auto-redirect nếu đã có admin token mà vào /admin/login
  if (pathname.startsWith('/admin/login')) {
    const adminToken   = request.cookies.get('admin_token')?.value;
    const expectedCode = process.env.ADMIN_SECRET_CODE || process.env.NEXT_PUBLIC_ADMIN_CODE;
    if (adminToken && adminToken === expectedCode) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Auto-redirect nếu đã đăng nhập mà vào /login
  if (user && isAuthPage && !pathname.startsWith('/admin/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // ── [H-02] Security Headers trên mọi response ──────────────────────────
  supabaseResponse.headers.set('X-Frame-Options', 'DENY');
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff');
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  supabaseResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
