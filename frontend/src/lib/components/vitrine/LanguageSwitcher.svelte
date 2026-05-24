<script lang="ts">
  import { lang, type AvailableLang } from '$lib/stores/lang';

  const options: { tag: AvailableLang; label: string }[] = [
    { tag: 'pt', label: 'PT' },
    { tag: 'en', label: 'EN' },
  ];
</script>

<div class="lang-switcher" aria-label="Seletor de idioma">
  {#each options as { tag, label }}
    <button
      class="lang-btn"
      class:active={$lang === tag}
      aria-pressed={$lang === tag}
      onclick={() => lang.set(tag)}
    >
      {label}
    </button>
  {/each}
</div>

<style>
  .lang-switcher {
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }

  .lang-btn {
    padding: 0.25rem 0.5rem;
    border: 1px solid transparent;
    border-radius: var(--radius);
    background: transparent;
    color: inherit;
    font-family: var(--font-sans);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }

  .lang-btn:hover {
    color: var(--pink);
    border-color: var(--pink);
  }

  .lang-btn.active {
    color: var(--pink);
    border-color: var(--pink);
  }
</style>
