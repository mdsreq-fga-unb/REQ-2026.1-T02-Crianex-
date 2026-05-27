import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import multer from 'multer';

const productRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo inválido. Use apenas JPG, PNG ou WEBP.'));
    }
  },
});

const generateSlug = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();

const PRODUCT_FIELDS = [
  'name_pt',
  'name_en',
  'tagline_pt',
  'tagline_en',
  'description_pt',
  'description_en',
  'icon_text',
  'color',
  'category_pt',
  'category_en',
  'published',
  'display_order',
  'image_url',
] as const;

productRouter.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado ou formato inválido.' });
    }

    const file = req.file;
    const fileExt = file.mimetype.split('/')[1];
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: storageError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });

    if (storageError) {
      console.log('Erro no Supabase Storage:', storageError.message);
      return res.status(400).json({ error: storageError.message });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('product-images').getPublicUrl(filePath);

    return res.status(200).json({ image_url: publicUrl });
  } catch {
    return res.status(500).json({ error: 'Erro interno ao processar imagem.' });
  }
});

productRouter.post('/', async (req, res) => {
  const {
    name_pt,
    name_en,
    tagline_pt,
    tagline_en,
    description_pt,
    description_en,
    icon_text,
    color,
    category_pt,
    category_en,
    published,
    display_order,
    image_url,
  } = req.body;

  if (!name_pt || !name_en) {
    return res.status(400).json({ error: 'Os campos name_pt e name_en são obrigatórios.' });
  }

  const slug = generateSlug(name_pt);

  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        name_pt,
        name_en,
        tagline_pt,
        tagline_en,
        description_pt,
        description_en,
        icon_text,
        color,
        category_pt,
        category_en,
        published,
        display_order,
        slug,
        image_url,
      },
    ])
    .select()
    .single();

  if (error) {
    console.log('Erro ao salvar no banco:', error.message);
    return res.status(400).json({ error: error.message });
  }
  return res.status(201).json(data);
});

productRouter.patch('/reorder', async (req, res) => {
  const { orders } = req.body;

  if (
    !Array.isArray(orders) ||
    orders.some(
      (o: unknown) =>
        !o ||
        typeof o !== 'object' ||
        !('id' in o) ||
        (o as Record<string, unknown>)['display_order'] == null
    )
  ) {
    return res
      .status(400)
      .json({ error: 'O array "orders" deve conter objetos com id e display_order.' });
  }

  const { error } = await supabase.rpc('reorder_products', { p_orders: orders });

  if (error) {
    console.log('Erro na transação de reordenação:', error.message);
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Produtos reordenados com sucesso!' });
});

productRouter.patch('/:id', async (req, res) => {
  const { id } = req.params;

  const alteredData = Object.fromEntries(
    PRODUCT_FIELDS.filter((k) => k in req.body).map((k) => [k, req.body[k]])
  );

  if (Object.keys(alteredData).length === 0) {
    return res.status(400).json({ error: 'Nenhum campo válido enviado.' });
  }

  if (alteredData['name_pt']) {
    alteredData['slug'] = generateSlug(alteredData['name_pt'] as string);
  }

  const { data, error } = await supabase
    .from('products')
    .update(alteredData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.log('Erro ao atualizar no banco:', error.message);
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json(data);
});

productRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('published, image_url')
    .eq('id', id)
    .single();

  if (fetchError) {
    const notFound = (fetchError as unknown as { code?: string }).code === 'PGRST116';
    return notFound
      ? res.status(404).json({ message: 'Produto não encontrado.' })
      : res.status(500).json({ error: fetchError.message });
  }
  if (!product) {
    return res.status(404).json({ message: 'Produto não encontrado.' });
  }

  if (product.published) {
    return res.status(409).json({
      message: 'Não é possível deletar um produto publicado. Despublique-o primeiro!',
    });
  }

  if (product.image_url) {
    const fileName = (product.image_url as string).split('/').pop();
    if (fileName) {
      const { error: storageError } = await supabase.storage
        .from('product-images')
        .remove([fileName]);
      if (storageError) {
        console.log('Erro ao remover imagem do Storage:', storageError.message);
      }
    }
  }

  const { error: deleteError } = await supabase.from('products').delete().eq('id', id);

  if (deleteError) {
    console.log('Erro ao deletar no banco:', deleteError.message);
    return res.status(400).json({ error: deleteError.message });
  }

  return res.status(204).send();
});

export { productRouter };
