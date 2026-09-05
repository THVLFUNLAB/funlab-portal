import { createAdminClient } from '@/utils/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(data);
}
