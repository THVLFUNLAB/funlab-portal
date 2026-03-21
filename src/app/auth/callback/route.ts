import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Xử lý cookie khi Server Component set
            }
          },
        },
      }
    )
    
    // Giao tiếp trao đổi Code Authorization lấy Session Supabase
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
       console.error('Lỗi nhận diện Google Session:', error.message)
       return NextResponse.redirect(`${origin}/login?error=GoogleOAuthFailed`)
    }

    if (data.session?.user) {
      // Kiểm tra ngay lập tức xem user đã thiết lập Họ Tên hay chưa
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', data.session.user.id).single();
      if (!profile || !profile.full_name) {
        // Lần đầu đăng nhập -> Ép redirect về Desktop Setup
        return NextResponse.redirect(`${origin}/profile/setup`)
      }
    }
  }

  // Đã có đủ thông tin -> Chuyển hướng về Trang chủ
  return NextResponse.redirect(`${origin}/`)
}
