import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: 'Thiếu UserId' }, { status: 400 })
    }

    // 1. Kiểm tra quyền Admin (Cơ chế admin_token cookie hiện tại của dự án)
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('admin_token')?.value
    const expectedToken = process.env.NEXT_PUBLIC_ADMIN_CODE || 'funlab2024'

    if (adminToken !== expectedToken) {
      return NextResponse.json({ error: 'Bạn không có quyền quản trị!' }, { status: 403 })
    }

    // 2. Khởi tạo Supabase Admin Client (Sử dụng Service Role Key)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // 3. Thực hiện xóa triệt để các dữ liệu liên quan
    console.log(`Admin is deleting user: ${userId}`);

    // a. Xóa dữ liệu điểm số (episode_scores)
    const { error: scoreError } = await supabaseAdmin
      .from('episode_scores')
      .delete()
      .eq('user_id', userId)
    
    if (scoreError) {
      console.error('Error deleting scores:', scoreError);
    }

    // b. Xóa thông tin Profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('Error deleting profile:', profileError);
    }

    // c. Xóa tài khoản khỏi Supabase Auth (Admin API)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (authError) {
      return NextResponse.json({ 
        error: 'Lỗi khi xóa tài khoản Auth: ' + authError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Đã xóa tài khoản và toàn bộ dữ liệu thành công.' 
    })

  } catch (err: any) {
    console.error('Unexpected error in delete-user route:', err);
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
