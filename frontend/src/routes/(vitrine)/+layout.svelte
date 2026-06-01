<script lang="ts">
  import '../../app.css';
  // Header — issue pendente (componente de navegação da vitrine)
  // Footer — issue #89
</script>

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
