<script lang="ts">
  import { lang } from '$lib/stores/lang';

  const UPDATED = '27/05/2026';

  const t = {
    meta: {
      title: { pt: 'Política de Privacidade — Crianex Hub', en: 'Privacy Policy — Crianex Hub' },
      desc: {
        pt: 'Como a Crianex coleta, usa e protege seus dados pessoais conforme a LGPD.',
        en: 'How Crianex collects, uses, and protects your personal data under LGPD.',
      },
    },
    eyebrow: { pt: 'Legal & Privacidade', en: 'Legal & Privacy' },
    h1: { pt: 'Política de Privacidade.', en: 'Privacy Policy.' },
    lede: {
      pt: 'Este documento descreve como a Crianex Hub trata os dados pessoais coletados por meio do formulário de contato, em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018 — LGPD).',
      en: 'This document describes how Crianex Hub handles personal data collected through the contact form, in accordance with Brazil\'s General Data Protection Law (Lei 13.709/2018 — LGPD).',
    },
    updated: { pt: 'Última atualização', en: 'Last updated' },
    sections: [
      {
        n: '01',
        title: { pt: 'Dados coletados', en: 'Data collected' },
        body: {
          pt: 'Ao preencher o formulário de contato coletamos: nome completo, endereço de e-mail corporativo, nome da empresa, produto de interesse e mensagem. Nenhum dado sensível (saúde, biometria, origem racial, etc.) é solicitado ou armazenado.',
          en: 'When you fill out the contact form we collect: full name, corporate e-mail address, company name, product of interest, and message. No sensitive data (health, biometrics, racial origin, etc.) is requested or stored.',
        },
      },
      {
        n: '02',
        title: { pt: 'Finalidade e base legal', en: 'Purpose and legal basis' },
        body: {
          pt: 'Os dados são tratados exclusivamente para responder à sua solicitação de contato comercial e avaliar a adequação dos nossos produtos às suas necessidades. A base legal é o legítimo interesse (Art. 7º, IX da LGPD) combinado com o consentimento explícito prestado no momento do envio.',
          en: 'Data is processed solely to respond to your commercial inquiry and assess the fit of our products to your needs. The legal basis is legitimate interest (Art. 7, IX of LGPD) combined with the explicit consent provided at submission.',
        },
      },
      {
        n: '03',
        title: { pt: 'Tempo de retenção', en: 'Retention period' },
        body: {
          pt: 'Os dados são retidos por até 24 meses a partir da data do contato ou até que você solicite a eliminação, o que ocorrer primeiro. Após esse prazo os registros são excluídos permanentemente de todos os nossos sistemas.',
          en: 'Data is retained for up to 24 months from the date of contact or until you request deletion, whichever comes first. After this period records are permanently deleted from all our systems.',
        },
      },
      {
        n: '04',
        title: { pt: 'Compartilhamento', en: 'Data sharing' },
        body: {
          pt: 'Não compartilhamos, vendemos ou cedemos seus dados pessoais a terceiros para fins comerciais. Os dados podem ser acessados apenas por colaboradores da Crianex diretamente envolvidos no atendimento da sua solicitação.',
          en: 'We do not share, sell, or transfer your personal data to third parties for commercial purposes. Data may be accessed only by Crianex staff directly involved in handling your request.',
        },
      },
      {
        n: '05',
        title: { pt: 'Seus direitos (Art. 18 LGPD)', en: 'Your rights (Art. 18 LGPD)' },
        body: {
          pt: 'Você pode, a qualquer momento: confirmar a existência de tratamento; acessar seus dados; corrigir dados incompletos ou inexatos; solicitar a anonimização, bloqueio ou eliminação; revogar o consentimento; e obter informações sobre o uso compartilhado. Para exercer qualquer direito, envie um e-mail para privacidade@crianex.com.br com o assunto "Direitos LGPD".',
          en: 'You may at any time: confirm the existence of processing; access your data; correct incomplete or inaccurate data; request anonymization, blocking, or deletion; revoke consent; and obtain information about shared use. To exercise any right, send an email to privacidade@crianex.com.br with the subject "LGPD Rights".',
        },
      },
      {
        n: '06',
        title: { pt: 'Encarregado de Dados (DPO)', en: 'Data Protection Officer (DPO)' },
        body: {
          pt: 'O encarregado pelo tratamento de dados pessoais da Crianex pode ser contactado pelo e-mail privacidade@crianex.com.br. Respondemos a todas as solicitações em até 15 dias úteis, conforme exigido pela LGPD.',
          en: 'The Crianex data protection officer can be contacted at privacidade@crianex.com.br. We respond to all requests within 15 business days, as required by LGPD.',
        },
      },
      {
        n: '07',
        title: { pt: 'Alterações nesta política', en: 'Changes to this policy' },
        body: {
          pt: 'Esta política pode ser atualizada periodicamente. A data de última atualização indicada no topo deste documento reflete sempre a versão vigente. O uso continuado do formulário de contato após uma atualização constitui aceite das novas condições.',
          en: 'This policy may be updated periodically. The last updated date shown at the top of this document always reflects the current version. Continued use of the contact form after an update constitutes acceptance of the new terms.',
        },
      },
    ],
  };
</script>

<svelte:head>
  <title>{t.meta.title[$lang]}</title>
  <meta name="description" content={t.meta.desc[$lang]} />
</svelte:head>

<div class="privacy-page">
  <section class="privacy-hero">
    <a href="/contato" class="back-link">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="transform: rotate(180deg)">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
      {$lang === 'pt' ? 'Voltar ao contato' : 'Back to contact'}
    </a>
    <div class="eyebrow">
      <span class="dot"></span>
      {t.eyebrow[$lang]}
    </div>
    <h1>{t.h1[$lang]}</h1>
    <p class="lede">{t.lede[$lang]}</p>
    <div class="meta-row">
      <span class="mono">{t.updated[$lang]}: {UPDATED}</span>
      <span class="pill">LGPD — Lei 13.709/2018</span>
    </div>
  </section>

  <section class="privacy-body">
    <div class="sections-grid">
      {#each t.sections as s, i}
        <div class="policy-section" class:full={i === t.sections.length - 1 && t.sections.length % 2 !== 0}>
          <div class="section-n mono">{s.n}</div>
          <h3>{s.title[$lang]}</h3>
          <p>{s.body[$lang]}</p>
        </div>
      {/each}
    </div>

    <div class="contact-card">
      <div class="card-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </div>
      <div>
        <p class="card-title">{$lang === 'pt' ? 'Dúvidas sobre esta política?' : 'Questions about this policy?'}</p>
        <p class="card-body">{$lang === 'pt' ? 'Entre em contato com nosso encarregado de dados.' : 'Contact our data protection officer.'}</p>
      </div>
      <a href="mailto:privacidade@crianex.com.br" class="btn ghost sm">
        privacidade@crianex.com.br
      </a>
    </div>
  </section>
</div>

<style>
  .privacy-page {
    --bg-elev: #ffffff;
    --bg: #fcfcfc;
    --line: #e8e6e2;
    --text-muted: #6b6862;
    --text-faint: #9a968e;
    --accent-soft: rgba(127, 63, 229, 0.08);
    --r-lg: 18px;
  }

  .privacy-hero {
    padding: 48px 40px 20px;
    border-bottom: 1px solid var(--line);
    max-width: 1200px;
    margin: 0 auto;
  }

  .back-link {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--text-muted);
    text-decoration: none;
    margin-bottom: 20px;
    transition: color 0.15s;
  }

  .back-link:hover {
    color: var(--venom);
  }

  .eyebrow {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 5px;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--purple);
    flex-shrink: 0;
  }

  h1 {
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 600;
    letter-spacing: -0.035em;
    line-height: 1;
    color: var(--venom);
    margin: 0 0 20px;
  }

  .lede {
    color: var(--text-muted);
    font-size: 16px;
    line-height: 1.6;
    max-width: 64ch;
    margin: 0 0 20px;
  }

  .meta-row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .mono {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-faint);
    letter-spacing: 0.06em;
  }

  .pill {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--purple);
    background: var(--accent-soft);
    border: 1px solid rgba(127, 63, 229, 0.2);
    border-radius: 100px;
    padding: 3px 10px;
  }

  .privacy-body {
    padding: 0 0 64px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .sections-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0;
    border-top: 1px solid var(--line);
    border-left: 1px solid var(--line);
    margin-bottom: 32px;
  }

  .policy-section {
    padding: 28px 32px;
    border-right: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .policy-section.full {
    grid-column: span 2;
  }

  .section-n {
    font-size: 11px;
    color: var(--text-faint);
    letter-spacing: 0.08em;
  }

  .policy-section h3 {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: var(--venom);
    margin: 0;
  }

  .policy-section p {
    color: var(--text-muted);
    font-size: 14px;
    line-height: 1.65;
    margin: 0;
  }

  .contact-card {
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: 28px 32px;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    margin: 0 40px;
  }

  .card-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: var(--accent-soft);
    color: var(--purple);
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .contact-card > div {
    flex: 1;
    min-width: 0;
  }

  .card-title {
    font-size: 15px;
    font-weight: 500;
    color: var(--venom);
    margin: 0 0 4px;
  }

  .card-body {
    font-size: 13px;
    color: var(--text-muted);
    margin: 0;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    border-radius: 8px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s;
    text-decoration: none;
    white-space: nowrap;
  }

  .btn.ghost {
    background: transparent;
    border: 1px solid var(--line);
    color: var(--venom);
  }

  .btn.ghost:hover {
    border-color: var(--text-muted);
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    .privacy-hero {
      padding: 32px 20px 28px;
    }

    .privacy-body {
      padding: 0 0 48px;
    }

    .sections-grid {
      grid-template-columns: 1fr;
    }

    .policy-section.full {
      grid-column: span 1;
    }

    .policy-section {
      padding: 22px 20px;
    }

    .contact-card {
      flex-direction: column;
      align-items: flex-start;
      padding: 20px;
      margin: 0 20px;
    }

    .btn.ghost {
      align-self: stretch;
      justify-content: center;
    }
  }
</style>
