// Catálogo fixo de tipos de evento de notificação (F08 · CP9). Cada tipo agrupa uma
// ou mais ações reais do sistema sob um mesmo template/cor — ex.: 'seguranca_controle'
// cobre login no site, spam no formulário de captação, login não autorizado e
// problemas de RLS. Tipos com implemented=false ainda não têm nenhum ponto do sistema
// que dispare notificações reais para eles (reservados para features futuras: CP7
// financeiro, CP3 dashboard, CP2 logs, CP8 suporte).
//
// Mantido em espelho em frontend/src/lib/constants/notification-types.ts — não há
// pacote compartilhado entre backend/frontend neste monorepo, então os dois arquivos
// precisam ser atualizados juntos ao adicionar/alterar um tipo.
export type NotificationEventType = {
  value: string;
  label: string;
  grupo: string;
  color: string;
  implemented: boolean;
  descricao: string;
};

export const NOTIFICATION_EVENT_TYPES: readonly NotificationEventType[] = [
  {
    value: 'novo_lead',
    label: 'Novo lead',
    grupo: 'Leads',
    color: '#7f3fe5',
    implemented: true,
    descricao: 'Disparado quando um novo lead é capturado pelo formulário público.',
  },
  {
    value: 'seguranca_controle',
    label: 'Segurança e controle',
    grupo: 'Segurança e controle',
    color: '#eab308',
    implemented: true,
    descricao:
      'Cobre login no site, spam no formulário de captação, login não autorizado e problemas de RLS.',
  },
  {
    value: 'financeiro',
    label: 'Financeiro',
    grupo: 'Financeiro',
    color: '#66df7a',
    implemented: false,
    descricao: 'Reservado para eventos financeiros (CP7 — ainda não implementado).',
  },
  {
    value: 'dashboard',
    label: 'Dashboard executivo',
    grupo: 'Dashboard',
    color: '#3b82f6',
    implemented: false,
    descricao: 'Reservado para alertas do dashboard executivo (CP3 — ainda não implementado).',
  },
  {
    value: 'logs_monitoramento',
    label: 'Logs e monitoramento',
    grupo: 'Operacional',
    color: '#06b6d4',
    implemented: false,
    descricao: 'Reservado para alertas de logs e monitoramento (CP2 — ainda não implementado).',
  },
  {
    value: 'suporte',
    label: 'Tickets de suporte',
    grupo: 'Suporte',
    color: '#ec4899',
    implemented: false,
    descricao: 'Reservado para tickets de suporte (CP8 — ainda não implementado).',
  },
];

const EVENT_TYPE_BY_VALUE = new Map(NOTIFICATION_EVENT_TYPES.map((t) => [t.value, t]));

export function getNotificationEventType(value: string): NotificationEventType | undefined {
  return EVENT_TYPE_BY_VALUE.get(value);
}

export function isImplementedEventType(value: string): boolean {
  return EVENT_TYPE_BY_VALUE.get(value)?.implemented === true;
}

export const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;
