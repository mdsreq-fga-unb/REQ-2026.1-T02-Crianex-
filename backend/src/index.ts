import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { router } from './routes/index.js';
import { createClient } from '@supabase/supabase-js';
import { error } from 'node:console';

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '..', '.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}


const app = express();
const PORT = Number(process.env['PORT'] ?? 3000);
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variáveis de ambiente do Supabase ausentes. Verifique PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(helmet());
app.use(
  cors({
    origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

app.get('/products', async (req, res) => {
  try{
    const {data, error} = await supabase
      .from('products')
      .select('*')
      .order('display_order', {ascending:true});
  
      if(error){
        return res.status(400).json({error: error.message});
      }

      return res.status(200).json(data);
    }catch(err){
      return res.status(500).json({error: 'Erro interno no servidor do back-end.'});
    }

});

app.post('/products/reorder', async (req, res) =>{
  try{
    const { orders } = req.body;
    
    if(!orders || !Array.isArray(orders)){
      return res.status(400).jsom({error: 'Formato de ordens inválidos.'});
    }

    const { error } = await supabase.rpc('reorder_products', {
      p_orders: orders
    });

    if(error){
      console.error(' [RPC ERROR]:', error.message);
      return res.status(400).json({error: error.message});
    }
    return res.status(200).json({success: true, message: 'Ordem atualizada com uscesso!'});
  }catch(err){
    return res.status(500).json({error: 'Erro interno ao reordenar produtos.'});
  }
});


app.use('/api', router);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: process.env['NODE_ENV'] });
});

app.listen(PORT, () => {
  console.log(`[backend] running on http://localhost:${PORT}`);
});
