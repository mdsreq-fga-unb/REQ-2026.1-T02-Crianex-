<script lang="ts">
  import '../../app.css';
  import { beforeNavigate, afterNavigate } from '$app/navigation';
  import { lang } from '$lib/stores/lang';
  import SiteHeader from '$lib/components/vitrine/SiteHeader.svelte';
  import PageLoader from '$lib/components/vitrine/PageLoader.svelte';

  // Loader de transição entre páginas
  let loading = false;
  let loaderBg = 'var(--vitrine-surface)';
  let showTimer: ReturnType<typeof setTimeout>;
  let hideTimer: ReturnType<typeof setTimeout>;

  $: loaderMsg = $lang === 'en' ? 'Loading' : 'Carregando';

  // 100ms antes de mostrar → navegações prefetchadas nunca mostram o loader
  beforeNavigate(({ to }) => {
    clearTimeout(hideTimer);
    loaderBg = (to?.url.pathname ?? '').includes('/sobre') ? '#f0f0ee' : 'var(--vitrine-surface)';
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

{#if loading}
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
    background-color: var(--vitrine-surface);
    color: var(--venom);
    scrollbar-width: none;
  }
  :global(body:has(.vitrine-root)::-webkit-scrollbar) {
    display: none;
  }
</style>
