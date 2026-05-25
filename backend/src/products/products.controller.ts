import type { Request, Response } from 'express';
import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  getProductForDeletion,
  listPublishedProducts,
  listAllProducts,
  reorderProducts,
  updateProduct,
  uploadProductImage,
  type ProductUploadFile,
} from './products.service.js';

type RequestWithUploadedFile = Request & { file?: ProductUploadFile };

export async function getProductsController(_req: Request, res: Response) {
  try {
    // If this controller is called through the admin route, return all products.
    // The admin route is protected by `requireAdminAuth` middleware.
    const { data, error } = _req.path.startsWith('/api/products/admin') ? await listAllProducts() : await listPublishedProducts();

    if (error) {
      console.error("❌ ERRO DO SUPABASE NA LISTAGEM:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ error: 'Erro interno no servidor do back-end.' });
  }
}

export async function uploadProductImageController(req: RequestWithUploadedFile, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado ou formato inválido.' });
    }

    const { publicUrl, error } = await uploadProductImage(req.file);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ image_url: publicUrl });
  } catch {
    return res.status(500).json({ error: 'Erro interno ao processar imagem.' });
  }
}

export async function createProductController(req: Request, res: Response) {
  try {
    const { data, error } = await createProduct(req.body);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch {
    return res.status(500).json({ error: 'Erro interno ao salvar produto.' });
  }
}

export async function reorderProductsController(req: Request, res: Response) {
  try {
    const { orders } = req.body;

    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: 'O corpo da requisição deve conter um array "orders".' });
    }

    const { error } = await reorderProducts(orders);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Produtos reordenados com sucesso!' });
  } catch {
    return res.status(500).json({ error: 'Erro interno ao reordenar produtos.' });
  }
}

export async function updateProductController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !id) {
      return res.status(400).json({ error: 'ID inválido.' });
    }
    const alteredData = req.body;

    const { data, error } = await updateProduct(id, alteredData);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ error: 'Erro interno ao atualizar produto.' });
  }
}

export async function deleteProductController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !id) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    const { data: product, error: fetchError } = await getProductForDeletion(id);

    if (!product || fetchError) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    if (product.published) {
      return res.status(409).json({ message: 'Não é possível deletar um produto publicado. Despublique-o primeiro.' });
    }

    if (product.image_url) {
      const { error: storageError } = await deleteProductImage(product.image_url);

      if (storageError) {
        console.log('Erro ao remover imagem do Storage:', storageError.message);
      }
    }

    const { error: deleteError } = await deleteProduct(id);

    if (deleteError) {
      return res.status(400).json({ error: deleteError.message });
    }

    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: 'Erro interno ao deletar produto.' });
  }
}
