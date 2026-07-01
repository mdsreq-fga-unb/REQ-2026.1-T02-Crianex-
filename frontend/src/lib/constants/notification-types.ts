// Paleta de cores selecionáveis ao personalizar um template de notificação — mesma
// paleta usada no editor de colunas do CRM (admin/crm/+page.svelte), para
// consistência visual entre os dois pontos de customização de cor do admin.
export const TEMPLATE_COLOR_PALETTE = [
  '#7f3fe5',
  '#e71f84',
  '#66df7a',
  '#3b82f6',
  '#f59e0b',
  '#06b6d4',
  '#ec4899',
  '#eab308',
] as const;

// Tipo de evento retornado por GET /admin/notification-templates/event-types
// (catálogo fixo definido em backend/src/notification-templates/notification-event-types.ts).
export type NotificationEventType = {
  value: string;
  label: string;
  grupo: string;
  color: string;
  implemented: boolean;
  descricao: string;
};
