<script lang="ts">
  import { lang } from '$lib/stores/lang';
  import { CHANNELS } from './contact';

  const t = {
    eyebrow: { pt: 'Contato comercial', en: 'Sales contact' },
    h1: { pt: 'Vamos conversar.', en: "Let's talk." },
    lede: {
      pt: 'Conte um pouco sobre o seu caso de uso e o produto que te interessa. Respondemos em até 24h úteis.',
      en: 'Tell us a bit about your use case and which product interests you. We reply within 24 business hours.',
    },
    btnLinkedin: { pt: 'LinkedIn', en: 'LinkedIn' },
    btnEmail: { pt: 'Enviar e-mail', en: 'Send email' },
  };
</script>

<div class="contact-info">
  <div class="eyebrow">
    <span class="dot"></span>
    {t.eyebrow[$lang]}
  </div>

  <h1>{t.h1[$lang]}</h1>
  <p class="lede">{t.lede[$lang]}</p>

  <div class="channels">
    {#each CHANNELS as ch}
      <div class="channel">
        <span class="k">{ch.k}</span>
        <span class="v">{ch.v[$lang]}</span>
      </div>
    {/each}
  </div>

  <div class="contact-btns">
    <a
      href="https://linkedin.com/company/crianex"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
      class="btn ghost sm"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        />
      </svg>
      {t.btnLinkedin[$lang]}
    </a>
    <a href="mailto:comercial@crianex.com.br" aria-label="Email" class="btn ghost sm">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
      {t.btnEmail[$lang]}
    </a>
  </div>
</div>

<style>
  .contact-info h1 {
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 600;
    letter-spacing: -0.035em;
    line-height: 1;
    color: var(--venom);
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 18px;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--pink);
    flex-shrink: 0;
  }

  .lede {
    color: var(--text-muted);
    font-size: 16px;
    line-height: 1.5;
    margin-top: 20px;
    max-width: 38ch;
  }

  .channels {
    margin-top: 36px;
    border-top: 1px solid var(--line);
  }

  .channel {
    display: grid;
    grid-template-columns: 100px 1fr;
    padding: 16px 0;
    gap: 12px;
    border-bottom: 1px solid var(--line);
    align-items: center;
  }

  .channel .k {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-faint);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .channel .v {
    font-size: 15px;
    color: var(--venom);
  }

  .contact-btns {
    margin-top: 28px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
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

  @media (max-width: 768px) {
    .contact-info h1 {
      font-size: clamp(28px, 8vw, 40px);
    }
  }
</style>
