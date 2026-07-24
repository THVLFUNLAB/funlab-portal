'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/profile/edit');

  const full_name  = (formData.get('full_name') as string || '').trim();
  const class_name = (formData.get('class_name') as string || '').trim();

  if (!full_name)  return { error: 'Vui lòng nhập họ tên.' };
  if (!class_name) return { error: 'Vui lòng nhập lớp.' };
  if (full_name.length > 60)  return { error: 'Tên quá dài (tối đa 60 ký tự).' };
  if (class_name.length > 10) return { error: 'Lớp quá dài (tối đa 10 ký tự).' };

  const { error } = await supabase
    .from('profiles')
    .update({ full_name, class_name })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/profile');
  revalidatePath('/');
  redirect('/profile');
}
