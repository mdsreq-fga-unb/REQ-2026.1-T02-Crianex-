export type InteractionType = 'nota' | 'call' | 'email';

export type CrmInteraction = {
  id: string;
  client_id: string;
  autor_id: string | null;
  autor_nome: string | null;
  tipo: string;
  conteudo: string;
  data: string;
  removed: boolean;
};
