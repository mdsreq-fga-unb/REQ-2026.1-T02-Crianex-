<script lang="ts">
  import { lang } from '$lib/stores/lang';
  import type { FooterProduct } from '../../../routes/(vitrine)/+layout.server';

  export let products: FooterProduct[] = [];

  const t = {
    tagline: {
      pt: 'Software house B2B · São Paulo',
      en: 'B2B software house · São Paulo',
    },
    cols: {
      products: { pt: 'Produtos', en: 'Products' },
      company: { pt: 'Empresa', en: 'Company' },
      resources: { pt: 'Recursos', en: 'Resources' },
    },
    copyright: { pt: '© 2026 Crianex Tecnologia Ltda.', en: '© 2026 Crianex Tecnologia Ltda.' },
    status: { pt: 'Todos os sistemas operacionais', en: 'All systems operational' },
  };

  const companyLinks = [
    { href: '/sobre', label: { pt: 'Sobre', en: 'About' } },
    { href: '/contato', label: { pt: 'Contato', en: 'Contact' } },
    { href: '#', label: { pt: 'Carreiras', en: 'Careers' } },
  ];

  const resourceLinks = [
    { href: '/faq', label: { pt: 'FAQ', en: 'FAQ' } },
    { href: '#', label: { pt: 'Documentação', en: 'Documentation' } },
    { href: '#', label: { pt: 'Blog', en: 'Blog' } },
  ];

  const socials: { name: string; href: string; path: string }[] = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/crianex',
      path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z',
    },
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
      <div class="socials">
        {#each socials as s (s.name)}
          <a
            class="social"
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={s.path} />
            </svg>
          </a>
        {/each}
      </div>
    </div>

    <div>
      <h5>{t.cols.products[$lang]}</h5>
      <ul>
        {#each products as p (p.slug)}
          <li><a href="/produtos/{p.slug}">{$lang === 'pt' ? p.name_pt : p.name_en}</a></li>
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

  .social {
    width: 32px;
    height: 32px;
    border-radius: 100px;
    border: 1px solid rgba(252, 252, 252, 0.15);
    display: grid;
    place-items: center;
    color: rgba(252, 252, 252, 0.7);
    transition:
      color 0.15s,
      border-color 0.15s;
  }

  .social:hover {
    color: var(--vitrine-surface);
    border-color: rgba(252, 252, 252, 0.4);
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
