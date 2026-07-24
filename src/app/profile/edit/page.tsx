import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import ProfileEditForm from "./ProfileEditForm";

export const metadata: Metadata = {
  title: "Chỉnh Sửa Hồ Sơ | Funlab",
};

export default async function ProfileEditPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/profile/edit');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, class_name')
    .eq('id', user.id)
    .single();

  return (
    <ProfileEditForm
      defaultName={profile?.full_name ?? ''}
      defaultClass={profile?.class_name ?? ''}
    />
  );
}
