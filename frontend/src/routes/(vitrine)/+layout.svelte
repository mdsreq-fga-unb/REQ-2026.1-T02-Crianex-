<script lang="ts">
  import '../../app.css';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { beforeNavigate, afterNavigate } from '$app/navigation';
  import { lang } from '$lib/stores/lang';
  import SiteHeader from '$lib/components/vitrine/SiteHeader.svelte';
  import PageLoader from '$lib/components/vitrine/PageLoader.svelte';

  // Loader de transição entre páginas
  let loading = false;
  let loaderBg = '#fcfcfc';
  let showTimer: ReturnType<typeof setTimeout>;
  let hideTimer: ReturnType<typeof setTimeout>;

  // Loader inicial: cobre o flash enquanto o estado do lang ainda hidrata no cliente
  // browser ? false → loader visível até onMount; server ? true → sem loader no SSR
  let langReady = !browser;

  onMount(() => {
    langReady = true;
  });

  $: loaderMsg = $lang === 'en' ? 'Loading' : 'Carregando';

  // 100ms antes de mostrar → navegações prefetchadas nunca mostram o loader
  beforeNavigate(({ to }) => {
    clearTimeout(hideTimer);
    loaderBg = (to?.url.pathname ?? '').includes('/sobre') ? '#f0f0ee' : '#fcfcfc';
    showTimer = setTimeout(() => {
      loading = true;
    }, 100);
  });

  // Mínimo 400ms visível para evitar flash
  afterNavigate(() => {
    clearTimeout(showTimer);
    if (loading) {
      hideTimer = setTimeout(() => {
        loading = false;
      }, 400);
    }
  });
  // Footer — issue #89
</script>

{#if !langReady || loading}
  <PageLoader bgColor={loaderBg} message={loaderMsg} />
{/if}

<SiteHeader />

<main class="vitrine-root">
  <slot />
</main>

<!-- Footer placeholder — issue #89 -->
<footer></footer>

<style>
  :global(body):has(.vitrine-root) {
    background-color: #fcfcfc;
    color: #060606;
    scrollbar-width: none;
  }
  :global(body:has(.vitrine-root)::-webkit-scrollbar) {
    display: none;
  }
</style>
