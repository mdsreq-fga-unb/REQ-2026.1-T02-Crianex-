<script lang="ts">
  import '../../app.css';
  import { beforeNavigate, afterNavigate } from '$app/navigation';
  import { lang } from '$lib/stores/lang';
  import PageLoader from '$lib/components/vitrine/PageLoader.svelte';

  let loading = false;
  let loaderBg = '#fcfcfc';

  let showTimer: ReturnType<typeof setTimeout>;
  let hideTimer: ReturnType<typeof setTimeout>;

  // Mensagem bilíngue reativa
  $: loaderMsg = $lang === 'en' ? 'Loading' : 'Carregando';

  // Espera 100ms antes de mostrar → navegações instantâneas (prefetch) nunca mostram o loader
  beforeNavigate(({ to }) => {
    clearTimeout(hideTimer);
    loaderBg = (to?.url.pathname ?? '').includes('/sobre') ? '#f0f0ee' : '#fcfcfc';
    showTimer = setTimeout(() => {
      loading = true;
    }, 100);
  });

  // Garante tempo mínimo de exibição de 400ms para evitar flash
  afterNavigate(() => {
    clearTimeout(showTimer);
    if (loading) {
      hideTimer = setTimeout(() => {
        loading = false;
      }, 400);
    }
  });
  // Header — issue pendente (componente de navegação da vitrine)
  // Footer — issue #89
</script>

{#if loading}
  <PageLoader bgColor={loaderBg} message={loaderMsg} />
{/if}

<!-- Header placeholder — substituir quando issue de header for implementada -->
<header></header>

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
