import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Gọi api getUser để refresh session và lấy User
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith('/login');
  
  // Tự động chặn truy cập vào trang profile, hay episode nếu chưa đăng nhập Google
  if (!user && !isAuthPage && (
    pathname.startsWith('/profile') || 
    pathname.startsWith('/episode')
  )) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
  }

  // Bảo vệ khu vực Admin Dashboard bằng Clearance Code (Cookie)
  if (pathname.startsWith('/admin/dashboard')) {
    const adminToken = request.cookies.get('admin_token')?.value;
    const expectedToken = process.env.NEXT_PUBLIC_ADMIN_CODE || 'funlab2024';
    
    if (adminToken !== expectedToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Nếu truy cập /admin/login mà ĐÃ có token xịn rồi thì đá qua dashboard luôn
  if (pathname.startsWith('/admin/login')) {
    const adminToken = request.cookies.get('admin_token')?.value;
    const expectedToken = process.env.NEXT_PUBLIC_ADMIN_CODE || 'funlab2024';
    if (adminToken === expectedToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Nếu đã đăng nhập mà lại truy cập /login thì tự đẩy về trang chủ
  if (user && isAuthPage && !pathname.startsWith('/admin/login')) {
     const url = request.nextUrl.clone()
     url.pathname = '/'
     return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Middleware áp dụng lên toàn ứng dụng ngoại trừ các file tĩnh ảnh, font,...
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
