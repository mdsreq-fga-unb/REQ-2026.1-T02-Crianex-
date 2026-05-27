// issue #79
import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import multer from 'multer'; // middleware para lidar com upload de imgs

const productRouter = Router();

const storage = multer.memoryStorage(); // guarda temporariamente na RAM

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    //cb -> callback para o multer de verificação de passagem
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // primiero parâmetro é de erro, segundo de permissão de download
    } else {
      cb(new Error('Formato de arquivo inválido. Use apenas JPG,PNG ou WEBP.'));
    }
  },
});

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD') // Separa ã em a + ~
    .replace(/[\u0300-\u036f]/g, '') // Remove os acentos flutuantes
    .replace(/[^a-z0-9 -]/g, '') // Remove caracteres especiais (símbolos, exclamações)
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .trim();
};

productRouter.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado ou formarto inválido.' });
    }

    const file = req.file;

    const fileExt = file.mimetype.split('/')[1]; // formato ['image/png'] => separa e pega ['png']
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: storageError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (storageError) {
      console.log('Erro no Supabase Storage:', storageError.message);
      return res.status(400).json({ error: storageError.message });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('product-images').getPublicUrl(filePath);

    return res.status(200).json({ image_url: publicUrl });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro interno ao processar imagem.' });
  }
});

productRouter.post('/', async (req, res) => {
  // captura os dados que o admin enviou
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
    .select() // Pede para o banco retornar o produto que acabou de ser criado (com o ID gerado pelo banco)
    .single(); // Garante que retorne apenas um objeto, e não uma lista/array

  if (error) {
    console.log('Erro ao salvar no banco:', error.message);
    return res.status(400).json({ error: error.message });
  }
  return res.status(201).json(data);
});

productRouter.patch('/reorder', async (req, res) => {
  const { orders } = req.body;

  if (!Array.isArray(orders)) {
    return res.status(400).json({ error: 'O corpo da requisição deve conter um array "orders".' });
  }

  const { error } = await supabase.rpc('reorder_products', {
    p_orders: orders,
  });

  if (error) {
    console.log('Erro na trasanção de reordenação:', error.message);
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Produtos reordenados com sucesso!' });
});

productRouter.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const alteredData = req.body;

  if (alteredData.name_pt) {
    alteredData.slug = generateSlug(alteredData.name_pt);
  }

  const { data, error } = await supabase
    .from('products')
    .update(alteredData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.log('Erro ao atulizar no bacon:', error.message);
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

  if (!product || fetchError) {
    return res.status(404).json({ message: 'Produto não encontrado:' });
  }

  if (product.published) {
    return res
      .status(409)
      .json({ message: 'Não é possivel deletar um porduto publicado. Despublique-o primeiro!' });
  }

  if (product.image_url) {
    const fileName = product.image_url.split('/').pop();

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
