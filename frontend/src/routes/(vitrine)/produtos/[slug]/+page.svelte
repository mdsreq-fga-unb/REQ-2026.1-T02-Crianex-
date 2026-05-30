<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
  const { product, canonical, selectedLang, canonicalBase } = data;

  const lang = selectedLang ?? 'pt';

  const name =
    lang === 'en' ? product.name_en || product.name_pt : product.name_pt || product.name_en;
  const tagline =
    lang === 'en'
      ? product.tagline_en || product.tagline_pt
      : product.tagline_pt || product.tagline_en;
  const description =
    lang === 'en'
      ? product.description_en || product.description_pt
      : product.description_pt || product.description_en;
</script>

<svelte:head>
  <title>{name} — Crianex</title>
  <meta name="description" content={tagline} />

  <meta property="og:type" content="product" />
  <meta property="og:url" content={canonical} />
  <meta property="og:title" content={name} />
  <meta property="og:description" content={tagline} />
  <meta property="og:locale" content={lang === 'en' ? 'en_US' : 'pt_BR'} />
  <meta property="og:locale:alternate" content={lang === 'en' ? 'pt_BR' : 'en_US'} />
  {#if product.image_url}
    <meta property="og:image" content={product.image_url} />
  {/if}

  <link rel="canonical" href={canonical} />
  <link rel="alternate" hreflang="pt-BR" href={canonicalBase} />
  <link rel="alternate" hreflang="en" href={`${canonicalBase}?lang=en`} />
</svelte:head>

<section class="product-page p-8">
  <h1 class="text-3xl font-bold mb-4">{name}</h1>
  <p class="text-lg text-zinc-500 mb-6">{tagline}</p>

  {#if product.image_url}
    <img src={product.image_url} alt={name} class="w-full max-w-3xl rounded-lg mb-6" />
  {/if}

  <div class="content prose text-zinc-200">
    <p class="whitespace-pre-wrap">{description || 'Sem descrição disponível.'}</p>
  </div>
</section>
