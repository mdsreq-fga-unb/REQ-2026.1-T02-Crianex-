import { createHash } from 'crypto';
import { getSupabaseClient } from '../config/supabase.js';

export type RatingInput = {
  article_id: string;
  rating: 'y' | 'n';
  ip: string;
  userAgent: string;
};

export type RatingTotals = {
  helpful: number;
  not_helpful: number;
};

export type RatingResult =
  | { success: true; totals: RatingTotals }
  | { success: false; already_rated: true; totals: RatingTotals };

function buildSessionHash(ip: string, userAgent: string): string {
  const dateString = new Date().toDateString();
  return createHash('sha256').update(ip + userAgent + dateString).digest('hex');
}

async function getArticleTotals(articleId: string): Promise<RatingTotals> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('faq_articles')
    .select('helpful_count, not_helpful_count')
    .eq('id', articleId)
    .single();

  if (error) throw error;
  return {
    helpful: (data as { helpful_count: number; not_helpful_count: number }).helpful_count,
    not_helpful: (data as { helpful_count: number; not_helpful_count: number }).not_helpful_count,
  };
}

export async function submitRating(input: RatingInput): Promise<RatingResult> {
  const supabase = getSupabaseClient();
  const session_hash = buildSessionHash(input.ip, input.userAgent);

  // 1. Verify article exists and is published
  const { data: article, error: articleError } = await supabase
    .from('faq_articles')
    .select('id, helpful_count, not_helpful_count')
    .eq('id', input.article_id)
    .eq('published', true)
    .maybeSingle();

  if (articleError) throw articleError;
  if (!article) throw Object.assign(new Error('Artigo não encontrado.'), { code: 'NOT_FOUND' });

  // 2. Check for duplicate rating
  const { data: existing, error: checkError } = await supabase
    .from('faq_ratings')
    .select('id')
    .eq('article_id', input.article_id)
    .eq('session_hash', session_hash)
    .maybeSingle();

  if (checkError) throw checkError;

  if (existing) {
    const totals = await getArticleTotals(input.article_id);
    return { success: false, already_rated: true, totals };
  }

  // 3. Insert rating
  const { error: insertError } = await supabase
    .from('faq_ratings')
    .insert([{ article_id: input.article_id, session_hash, rating: input.rating }]);

  if (insertError) throw insertError;

  // 4. Increment counter atomically
  const counterField = input.rating === 'y' ? 'helpful_count' : 'not_helpful_count';
  const currentValue =
    input.rating === 'y'
      ? (article as { helpful_count: number }).helpful_count
      : (article as { not_helpful_count: number }).not_helpful_count;

  await supabase
    .from('faq_articles')
    .update({ [counterField]: currentValue + 1 })
    .eq('id', input.article_id);

  const totals = await getArticleTotals(input.article_id);
  return { success: true, totals };
}