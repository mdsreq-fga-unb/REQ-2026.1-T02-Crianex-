export type Lang = 'pt' | 'en';

export type Product = {
  id: string;
  slug: string;
  name_pt: string;
  name_en: string;
  category_pt: string | null;
  category_en: string | null;
};

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

export const CHANNELS = [
  { k: 'EMAIL', v: { pt: 'contato@crianex.com', en: 'contato@crianex.com' } },
  { k: 'LINKEDIN', v: { pt: 'linkedin.com/company/crianex', en: 'linkedin.com/company/crianex' } },
  { k: 'WHATSAPP', v: { pt: 'Disponível em breve', en: 'Available soon' } },
  { k: 'HORÁRIO', v: { pt: 'Seg–Sex, 9h–18h (BRT)', en: 'Mon–Fri, 9am–6pm (BRT)' } },
] as const;

export function buildPayload(form: FormState): Record<string, unknown> {
  return {
    name: form.name,
    email: form.email,
    ...(form.company ? { company: form.company } : {}),
    ...(form.product && form.product !== 'other' ? { product_interest: form.product } : {}),
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
    product: '',
    message: '',
    consent: false,
    website: '',
  };
}
