CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    name_pt TEXT NOT NULL,
    name_en TEXT NOT NULL,

    slug TEXT NOT NULL UNIQUE,

    tagline_pt TEXT NOT NULL,
    tagline_en TEXT NOT NULL,
    description_pt TEXT,
    description_en TEXT,

    icon_text VARCHAR(4),
    color VARCHAR(7),

    category_pt TEXT,
    category_en TEXT,
    image_url TEXT,

    published BOOLEAN DEFAULT false NOT NULL,

    display_order INTEGER DEFAULT 0 NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_products_published_order ON public.products (published, display_order);

CREATE TRIGGER handle_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime();

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;


-- Leitura pública restrita a produtos publicados (anon + authenticated)
CREATE POLICY "Permitir leitura pública de produtos publicados"
ON public.products
FOR SELECT
USING (published = true);

-- Escrita exclusiva para o backend via service_role
CREATE POLICY "Permitir modificações apenas para usuários autenticados"
ON public.products
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES (
    'product-images',
    'product-images',
    true,
    ARRAY['image/jpeg', 'image/png', 'image/webp'],
    2097152
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Imagens do produto são publicas para visualização"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Apenas usuários autenticados fazem upload de imagens"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');
