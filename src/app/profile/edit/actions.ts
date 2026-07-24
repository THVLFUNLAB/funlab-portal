'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ProfileState = { error?: string; success?: boolean } | null;

export async function updateProfile(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/profile/edit');

  const full_name  = (formData.get('full_name') as string || '').trim();
  const class_name = (formData.get('class_name') as string || '').trim();

  if (!full_name)  return { error: 'Vui lòng nhập họ và tên.' };
  if (!class_name) return { error: 'Vui lòng chọn lớp.' };
  if (full_name.length > 60)  return { error: 'Tên quá dài (tối đa 60 ký tự).' };

  const { error } = await supabase
    .from('profiles')
    .update({ full_name, class_name })
    .eq('id', user.id);

  if (error) return { error: `Lỗi lưu dữ liệu: ${error.message}` };

  revalidatePath('/profile');
  revalidatePath('/');
  redirect('/profile');
}
