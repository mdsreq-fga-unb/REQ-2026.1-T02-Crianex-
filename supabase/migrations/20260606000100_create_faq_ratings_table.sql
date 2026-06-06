CREATE TABLE public.faq_ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID NOT NULL REFERENCES public.faq_articles(id) ON DELETE CASCADE,
    session_hash TEXT NOT NULL,
    rating TEXT NOT NULL CHECK (rating IN ('y', 'n')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_faq_ratings_article_session UNIQUE (article_id, session_hash)
);

CREATE INDEX idx_faq_ratings_article_id ON public.faq_ratings (article_id);

ALTER TABLE public.faq_ratings ENABLE ROW LEVEL SECURITY;

-- INSERT público sem autenticação (qualquer visitante pode avaliar)
CREATE POLICY "Permitir avaliações públicas"
ON public.faq_ratings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- SELECT apenas para service_role (owners via backend)
CREATE POLICY "Permitir leitura apenas para service_role"
ON public.faq_ratings
FOR SELECT
TO service_role
USING (true);
