<script lang="ts">
  import '../../app.css';
  import SiteFooter from '$lib/components/vitrine/SiteFooter.svelte';
  import type { LayoutData } from './$types';
  // Header — issue pendente (componente de navegação da vitrine)

  export let data: LayoutData;
</script>

<!-- Header placeholder — substituir quando issue de header for implementada -->
<header></header>

<main class="vitrine-root">
  <slot />
</main>

<SiteFooter products={data.footerProducts} />

<style>
  :global(body):has(.vitrine-root) {
    background-color: #fcfcfc;
    color: #060606;
  }
</style>
