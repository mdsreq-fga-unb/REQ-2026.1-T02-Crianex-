<script lang="ts">
  import { env } from '$env/dynamic/public';
  import { lang } from '$lib/stores/lang';
  import { buildPayload, resolveStatus, defaultForm } from './contact';
  import type { Product } from './contact';

  export let products: Product[] = [];

  const API_BASE = env.PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

  const t = {
    fields: {
      name: { pt: 'Nome completo', en: 'Full name' },
      email: { pt: 'E-mail corporativo', en: 'Work email' },
      company: { pt: 'Empresa', en: 'Company' },
      product: { pt: 'Produto de interesse', en: 'Product of interest' },
      message: { pt: 'Mensagem', en: 'Message' },
    },
    placeholders: {
      name: { pt: 'ex. Marina Pereira', en: 'e.g. Marina Pereira' },
      email: { pt: 'voce@empresa.com', en: 'you@company.com' },
      company: { pt: 'Nome da empresa', en: 'Company name' },
      message: { pt: 'Como podemos ajudar?', en: 'How can we help?' },
    },
    productOther: { pt: 'Outro / não tenho certeza', en: 'Other / not sure' },
    hint: { pt: 'Resposta em até 24h úteis', en: 'Reply within 24h biz.' },
    submit: { pt: 'Enviar mensagem', en: 'Send message' },
    lgpdPrefix: {
      pt: 'Ao enviar, você concorda com nossa ',
      en: 'By submitting, you agree to our ',
    },
    lgpdLink: { pt: 'Política de Privacidade', en: 'Privacy Policy' },
    lgpdSuffix: { pt: '.', en: '.' },
    successTitle: { pt: 'Recebemos sua mensagem!', en: 'Message received!' },
    successBody: {
      pt: 'Retornaremos em até 24 horas.',
      en: "We'll get back to you within 24 hours.",
    },
    sendAnother: { pt: 'Enviar outra', en: 'Send another' },
    errorGeneric: {
      pt: 'Erro ao enviar. Tente novamente.',
      en: 'Failed to send. Please try again.',
    },
    errorRate: {
      pt: 'Muitas tentativas. Aguarde alguns minutos.',
      en: 'Too many attempts. Please wait a few minutes.',
    },
  };

  import type { SubmitStatus } from './contact';

  let status: SubmitStatus = 'idle';
  let errorMsg = '';
  let form = defaultForm();

  function reset() {
    form = defaultForm();
    status = 'idle';
    errorMsg = '';
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    status = 'loading';
    errorMsg = '';

    try {
      const res = await fetch(`${API_BASE}/api/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(form)),
      });

      const resolved = resolveStatus(res.status);
      status = resolved.status;
      if (resolved.errorKey === 'rate') errorMsg = t.errorRate[$lang];
      if (resolved.errorKey === 'generic') errorMsg = t.errorGeneric[$lang];
    } catch {
      status = 'error';
      errorMsg = t.errorGeneric[$lang];
    }
  }
</script>

<div class="form">
  {#if status === 'success'}
    <div class="form-success">
      <div class="check">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h3>{t.successTitle[$lang]}</h3>
      <p>{t.successBody[$lang]}</p>
      <button class="btn ghost sm" onclick={reset}>{t.sendAnother[$lang]}</button>
    </div>
  {:else}
    <form onsubmit={handleSubmit} novalidate>
      <div style="display:none" aria-hidden="true">
        <label for="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabindex="-1"
          autocomplete="off"
          bind:value={form.website}
        />
      </div>

      <div class="field">
        <label for="name">{t.fields.name[$lang]}</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autocomplete="name"
          placeholder={t.placeholders.name[$lang]}
          bind:value={form.name}
        />
      </div>

      <div class="field-row">
        <div class="field">
          <label for="email">{t.fields.email[$lang]}</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autocomplete="email"
            placeholder={t.placeholders.email[$lang]}
            bind:value={form.email}
          />
        </div>
        <div class="field">
          <label for="company">{t.fields.company[$lang]}</label>
          <input
            id="company"
            name="company"
            type="text"
            autocomplete="organization"
            placeholder={t.placeholders.company[$lang]}
            bind:value={form.company}
          />
        </div>
      </div>

      <div class="field">
        <label for="product">{t.fields.product[$lang]}</label>
        <select id="product" name="product" bind:value={form.product}>
          <option value="" disabled>{$lang === 'pt' ? 'Selecione um produto' : 'Select a product'}</option>
          {#each products as p}
            <option value={p.slug}>
              {$lang === 'pt' ? p.name_pt : p.name_en}{p.category_pt || p.category_en ? ` — ${$lang === 'pt' ? (p.category_pt ?? p.category_en) : (p.category_en ?? p.category_pt)}` : ''}
            </option>
          {/each}
          <option value="other">{t.productOther[$lang]}</option>
        </select>
      </div>

      <div class="field">
        <label for="message">{t.fields.message[$lang]}</label>
        <textarea
          id="message"
          name="message"
          required
          placeholder={t.placeholders.message[$lang]}
          bind:value={form.message}
        ></textarea>
      </div>

      {#if status === 'error'}
        <p class="error-msg" role="alert">{errorMsg}</p>
      {/if}

      <label class="consent-row">
        <input type="checkbox" bind:checked={form.consent} required />
        <span>
          {t.lgpdPrefix[$lang]}<a href="/privacidade" target="_blank" rel="noopener noreferrer"
            >{t.lgpdLink[$lang]}</a
          >{t.lgpdSuffix[$lang]}
        </span>
      </label>

      <div class="form-submit">
        <span class="hint">↩ {t.hint[$lang]}</span>
        <button type="submit" class="btn" disabled={status === 'loading' || !form.consent}>
          {#if status === 'loading'}
            <span class="spinner" aria-label="Enviando…"></span>
          {:else}
            {t.submit[$lang]}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="arrow"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          {/if}
        </button>
      </div>
    </form>
  {/if}
</div>

<style>
  .form {
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: 32px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 18px;
  }

  .field label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .field input,
  .field select,
  .field textarea {
    background: var(--bg);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 11px 14px;
    font-family: inherit;
    font-size: 14px;
    color: var(--venom);
    outline: none;
    transition:
      border-color 0.15s,
      box-shadow 0.15s;
  }

  .field input:focus,
  .field select:focus,
  .field textarea:focus {
    border-color: var(--purple);
    box-shadow: 0 0 0 4px var(--accent-soft);
  }

  .field textarea {
    min-height: 110px;
    resize: vertical;
  }

  .field select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236f6e78' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
    cursor: pointer;
  }

  .field select option {
    background: #ffffff;
    color: var(--venom);
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .form-submit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    margin-bottom: 16px;
  }

  .form-submit .hint {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-faint);
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    border-radius: 8px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s;
    border: none;
    background: #060606;
    color: #ffffff;
    text-decoration: none;
  }

  .btn:hover {
    opacity: 0.88;
  }
  .btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .btn.ghost {
    background: transparent;
    border: 1px solid var(--line);
    color: var(--venom);
  }

  .btn.ghost:hover {
    border-color: var(--text-muted);
    opacity: 1;
  }

  .btn.sm {
    padding: 7px 14px;
    font-size: 13px;
  }

  .arrow {
    transition: transform 0.15s;
  }
  .btn:hover .arrow {
    transform: translateX(3px);
  }

  .consent-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 12px;
    color: var(--text-faint);
    line-height: 1.5;
    cursor: pointer;
  }

  .consent-row input[type='checkbox'] {
    margin-top: 2px;
    flex-shrink: 0;
    accent-color: var(--purple);
    cursor: pointer;
  }

  .consent-row a {
    color: #60a5fa;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .consent-row a:hover {
    color: #93c5fd;
  }

  .error-msg {
    font-size: 13px;
    color: #f87171;
    margin-bottom: 12px;
  }

  .spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .form-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    min-height: 320px;
    text-align: center;
  }

  .form-success .check {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--pos-soft);
    color: var(--pos-deep);
    display: grid;
    place-items: center;
  }

  .form-success h3 {
    font-size: 22px;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: var(--venom);
  }

  .form-success p {
    color: var(--text-muted);
    font-size: 14px;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .field-row {
      grid-template-columns: 1fr;
    }
  }
</style>
