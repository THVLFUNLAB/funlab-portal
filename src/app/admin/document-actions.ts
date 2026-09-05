'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export interface DocumentData {
  id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  cover_emoji?: string;
  category: string;
  content: string;
  is_published: boolean;
}

/** Lấy toàn bộ documents (admin — không lọc is_published) */
export async function getAllDocuments() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('documents')
    .select('id, slug, title, subtitle, cover_emoji, category, is_published, created_at, updated_at')
    .order('created_at', { ascending: false });
  if (error) return { error: error.message, documents: [] };
  return { documents: data ?? [] };
}

/** Lấy 1 document theo slug (admin — bao gồm cả unpublished) */
export async function getDocumentBySlug(slug: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return { error: error.message, document: null };
  return { document: data };
}

/** Tạo mới hoặc cập nhật document */
export async function upsertDocument(doc: DocumentData) {
  const supabase = createAdminClient();

  // Tạo slug từ title nếu chưa có
  if (!doc.slug) {
    doc.slug = doc.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  const payload = {
    slug: doc.slug,
    title: doc.title,
    subtitle: doc.subtitle || null,
    cover_emoji: doc.cover_emoji || '📄',
    category: doc.category,
    content: doc.content,
    is_published: doc.is_published,
  };

  let result;
  if (doc.id) {
    result = await supabase
      .from('documents')
      .update(payload)
      .eq('id', doc.id)
      .select('id, slug')
      .single();
  } else {
    result = await supabase
      .from('documents')
      .insert(payload)
      .select('id, slug')
      .single();
  }

  if (result.error) return { error: result.error.message };

  revalidatePath('/du-an');
  revalidatePath(`/du-an/${result.data?.slug}`);
  return { success: true, id: result.data?.id, slug: result.data?.slug };
}

/** Xoá document */
export async function deleteDocument(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/du-an');
  return { success: true };
}

/** Toggle publish */
export async function toggleDocumentPublish(id: string, currentState: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('documents')
    .update({ is_published: !currentState })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/du-an');
  return { success: true };
}
