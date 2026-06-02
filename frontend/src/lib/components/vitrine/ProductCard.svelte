<script lang="ts">
  import {
    resolveField,
    accentForIndex,
    type HomeProduct,
    type AvailableLang,
  } from '../../../routes/(vitrine)/home';

  interface Props {
    product: HomeProduct;
    lang: AvailableLang;
    index?: number;
  }

  let { product, lang, index = 0 }: Props = $props();

  const name = $derived(resolveField(product.name_pt, product.name_en, lang));
  const tagline = $derived(resolveField(product.tagline_pt, product.tagline_en, lang));
  const category = $derived(resolveField(product.category_pt, product.category_en, lang));
  const accent = $derived(accentForIndex(index));
  const initials = $derived(
    name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
  );
  const learnMore = $derived(lang === 'pt' ? 'Saiba mais' : 'Learn more');
</script>

<article class="product-card">
  <a
    href="/produtos/{product.slug}"
    class="card-visual"
    style="background: {accent};"
    aria-hidden="true"
    tabindex="-1"
  >
    {#if product.image_url}
      <img src={product.image_url} alt={name} class="card-img" loading="lazy" />
    {:else}
      <span class="card-initials">{initials}</span>
    {/if}
  </a>

  <div class="card-body">
    {#if category}
      <span class="card-category">{category}</span>
    {/if}
    <h3 class="card-name"><a href="/produtos/{product.slug}">{name}</a></h3>
    {#if tagline}
      <p class="card-tagline">{tagline}</p>
    {/if}
    <a href="/produtos/{product.slug}" class="card-cta" aria-label="{learnMore} — {name}">
      {learnMore}
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
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </a>
  </div>
</article>

<style>
  .product-card {
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    border: 1px solid var(--line, #e8e6e2);
    background: var(--bg-elev, #ffffff);
    overflow: hidden;
    transition:
      box-shadow 0.2s,
      transform 0.2s;
  }

  .product-card:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .card-visual {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 160px;
    position: relative;
    overflow: hidden;
    text-decoration: none;
  }

  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-initials {
    font-family: var(--font-mono);
    font-size: 2rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    letter-spacing: -0.02em;
  }

  .card-body {
    padding: 20px 22px 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .card-category {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-faint, #9a968e);
  }

  .card-name {
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0;
  }

  .card-name a {
    color: inherit;
    text-decoration: none;
  }

  .card-name a:hover {
    color: var(--purple, #7f3fe5);
  }

  .card-tagline {
    font-size: 0.875rem;
    line-height: 1.55;
    color: var(--text-muted, #6b6862);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--purple, #7f3fe5);
    text-decoration: none;
    transition: gap 0.15s;
  }

  .card-cta:hover {
    gap: 10px;
  }
</style>
