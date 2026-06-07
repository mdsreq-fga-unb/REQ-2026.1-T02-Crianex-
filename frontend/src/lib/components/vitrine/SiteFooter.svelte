<script lang="ts">
  import { lang } from '$lib/stores/lang';
  import type { FooterProduct } from '../../../routes/(vitrine)/+layout.server';

  export let products: FooterProduct[] = [];

  const t = {
    tagline: {
      pt: 'Software house B2B · Brasília',
      en: 'B2B software house · Brasília',
    },
    cols: {
      products: { pt: 'Produtos', en: 'Products' },
      company: { pt: 'Empresa', en: 'Company' },
      resources: { pt: 'Recursos', en: 'Resources' },
    },
    copyright: { pt: '© 2026 Crianex Tecnologia Ltda.', en: '© 2026 Crianex Tecnologia Ltda.' },
    status: { pt: 'Todos os sistemas funcionando', en: 'All systems working' },
  };

  const companyLinks = [
    { href: '/sobre', label: { pt: 'Sobre', en: 'About' } },
    { href: '/contato', label: { pt: 'Contato', en: 'Contact' } },
  ];

  const resourceLinks = [
    { href: '/faq', label: { pt: 'FAQ', en: 'FAQ' } },
    { href: '#', label: { pt: 'Documentação', en: 'Documentation' } },
    { href: '#', label: { pt: 'Blog', en: 'Blog' } },
  ];
</script>

<footer class="site-footer">
  <div class="site-footer-grid">
    <div class="footer-brand">
      <div class="brand">
        <svg viewBox="0 0 90 80" width="26" height="23" aria-hidden="true">
          <polygon fill="#E71F84" points="5,5 33,5 45,37 17,37" />
          <polygon fill="#66DF7A" points="57,5 85,5 73,37 45,37" />
          <polygon fill="#FCFCFC" points="17,43 45,43 33,75 5,75" />
          <polygon fill="#7F3FE5" points="45,43 73,43 85,75 57,75" />
        </svg>
        <span>Crianex Hub</span>
      </div>
      <p class="tagline">{t.tagline[$lang]}</p>
      <div class="socials"></div>
    </div>

    <div>
      <h5>{t.cols.products[$lang]}</h5>
      <ul>
        {#each products as p (p.slug)}
          <li>
            <a href="/?produto={p.slug}#products-carousel"
              >{$lang === 'pt' ? p.name_pt : p.name_en}</a
            >
          </li>
        {/each}
      </ul>
    </div>

    <div>
      <h5>{t.cols.company[$lang]}</h5>
      <ul>
        {#each companyLinks as l}
          <li><a href={l.href}>{l.label[$lang]}</a></li>
        {/each}
      </ul>
    </div>

    <div>
      <h5>{t.cols.resources[$lang]}</h5>
      <ul>
        {#each resourceLinks as l}
          <li><a href={l.href}>{l.label[$lang]}</a></li>
        {/each}
      </ul>
    </div>
  </div>

  <div class="bottom">
    <span>{t.copyright[$lang]}</span>
    <span class="status">
      <span class="status-dot" aria-hidden="true"></span>
      {t.status[$lang]}
    </span>
  </div>
</footer>

<style>
  .site-footer {
    background: var(--venom);
    color: rgba(252, 252, 252, 0.7);
    padding: 56px 40px 32px;
    font-size: 13px;
  }

  .site-footer-grid {
    display: grid;
    grid-template-columns: 1.4fr repeat(3, 1fr);
    gap: 32px;
    margin-bottom: 48px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--vitrine-surface);
    font-weight: 600;
    margin-bottom: 16px;
  }

  .tagline {
    color: rgba(252, 252, 252, 0.55);
    font-size: 13px;
    line-height: 1.55;
    max-width: 34ch;
    margin: 0;
  }

  .socials {
    display: flex;
    gap: 10px;
    margin-top: 22px;
  }

  .site-footer h5 {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(252, 252, 252, 0.45);
    margin: 0 0 14px;
    font-weight: 500;
  }

  .site-footer ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .site-footer a {
    color: inherit;
    text-decoration: none;
    transition: color 0.15s;
  }

  .site-footer ul a:hover {
    color: var(--vitrine-surface);
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    border-top: 1px solid rgba(252, 252, 252, 0.08);
    font-family: var(--font-mono);
    font-size: 11px;
    color: rgba(252, 252, 252, 0.4);
    letter-spacing: 0.04em;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--green);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(102, 223, 122, 0.5);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(102, 223, 122, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(102, 223, 122, 0);
    }
  }

  @media (max-width: 768px) {
    .site-footer {
      padding: 40px 20px 24px;
    }

    .site-footer-grid {
      grid-template-columns: 1fr 1fr;
    }

    .footer-brand {
      grid-column: 1 / -1;
    }

    .bottom {
      flex-direction: column;
      gap: 10px;
      text-align: center;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .status-dot {
      animation: none;
    }
  }
</style>
