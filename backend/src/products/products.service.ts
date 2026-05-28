import { getAdminSupabase } from '../lib/adminSupabase.js';

export type ProductOrderItem = {
  id: string;
  display_order: number;
};

export type ProductInput = {
  name_pt: string;
  name_en: string;
  tagline_pt: string;
  tagline_en: string;
  description_pt?: string | null;
  description_en?: string | null;
  icon_text?: string | null;
  color?: string | null;
  category_pt?: string | null;
  category_en?: string | null;
  published?: boolean;
  display_order?: number;
  image_url?: string | null;
};

export type ProductUploadFile = {
  mimetype: string;
  buffer: Buffer;
};

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

export async function listPublishedProducts() {
  const supabase = getAdminSupabase();

  return supabase.from('products').select('*').order('display_order', { ascending: true });
}

export async function listAllProducts() {
  const supabase = getAdminSupabase();

  return supabase.from('products').select('*').order('display_order', { ascending: true });
}

export async function uploadProductImage(file: ProductUploadFile) {
  const supabase = getAdminSupabase();
  const fileExt = file.mimetype.split('/')[1];
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error } = await supabase.storage.from('product-images').upload(fileName, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });

  if (error) {
    return { error };
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);

  return { publicUrl: data.publicUrl };
}

export async function createProduct(input: ProductInput) {
  const supabase = getAdminSupabase();
  const slug = generateSlug(input.name_pt);

  return supabase
    .from('products')
    .insert([
      {
        name_pt: input.name_pt,
        name_en: input.name_en,
        tagline_pt: input.tagline_pt,
        tagline_en: input.tagline_en,
        description_pt: input.description_pt,
        description_en: input.description_en,
        icon_text: input.icon_text,
        color: input.color,
        category_pt: input.category_pt,
        category_en: input.category_en,
        published: input.published,
        display_order: input.display_order,
        slug,
        image_url: input.image_url,
      },
    ])
    .select()
    .single();
}

export async function reorderProducts(orders: ProductOrderItem[]) {
  const supabase = getAdminSupabase();

  return supabase.rpc('reorder_products', { p_orders: orders });
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const supabase = getAdminSupabase();
  const payload = {
    ...input,
    ...(input.name_pt ? { slug: generateSlug(input.name_pt) } : {}),
  };

  return supabase.from('products').update(payload).eq('id', id).select().single();
}

export async function getProductForDeletion(id: string) {
  const supabase = getAdminSupabase();

  return supabase.from('products').select('published, image_url').eq('id', id).single();
}

export async function deleteProduct(id: string) {
  const supabase = getAdminSupabase();

  return supabase.from('products').delete().eq('id', id);
}

export async function deleteProductImage(imageUrl: string) {
  const supabase = getAdminSupabase();
  const fileName = imageUrl.split('/').pop();

  if (!fileName) {
    return { error: null };
  }

  return supabase.storage.from('product-images').remove([fileName]);
}
