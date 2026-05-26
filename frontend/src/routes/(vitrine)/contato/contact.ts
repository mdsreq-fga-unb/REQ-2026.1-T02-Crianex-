export type Lang = 'pt' | 'en';

export type FormState = {
  name: string;
  email: string;
  company: string;
  product: string;
  message: string;
  consent: boolean;
  website: string;
};

export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export const PRODUCTS = [
  { id: 'avali', name: 'Avali', cat: { pt: 'Gestão Educacional', en: 'Education Management' } },
  {
    id: 'pontua',
    name: 'Pontua',
    cat: { pt: 'Engajamento & Recompensas', en: 'Engagement & Rewards' },
  },
  {
    id: 'notifly',
    name: 'Notifly',
    cat: { pt: 'Notificações & Mensageria', en: 'Notifications & Messaging' },
  },
  {
    id: 'trilho',
    name: 'Trilho',
    cat: { pt: 'Onboarding & Treinamento', en: 'Onboarding & Training' },
  },
  { id: 'atende', name: 'Atende', cat: { pt: 'Suporte ao Cliente', en: 'Customer Support' } },
  { id: 'ledger', name: 'Ledger', cat: { pt: 'Faturamento Recorrente', en: 'Recurring Billing' } },
] as const;

export const CHANNELS = [
  { k: 'EMAIL', v: { pt: 'comercial@crianex.com.br', en: 'comercial@crianex.com.br' } },
  { k: 'LINKEDIN', v: { pt: 'linkedin.com/company/crianex', en: 'linkedin.com/company/crianex' } },
  { k: 'WHATSAPP', v: { pt: 'Disponível em breve', en: 'Available soon' } },
  { k: 'HORÁRIO', v: { pt: 'Seg–Sex, 9h–18h (BRT)', en: 'Mon–Fri, 9am–6pm (BRT)' } },
] as const;

export function buildPayload(form: FormState): Record<string, unknown> {
  return {
    name: form.name,
    email: form.email,
    ...(form.company ? { company: form.company } : {}),
    ...(form.product !== 'other' ? { product_interest: form.product } : {}),
    message: form.message,
    website: form.website,
  };
}

export function resolveStatus(httpStatus: number): {
  status: SubmitStatus;
  errorKey: 'rate' | 'generic' | null;
} {
  if (httpStatus === 201 || httpStatus === 200) return { status: 'success', errorKey: null };
  if (httpStatus === 429) return { status: 'error', errorKey: 'rate' };
  return { status: 'error', errorKey: 'generic' };
}

export function defaultForm(): FormState {
  return {
    name: '',
    email: '',
    company: '',
    product: 'avali',
    message: '',
    consent: false,
    website: '',
  };
}
