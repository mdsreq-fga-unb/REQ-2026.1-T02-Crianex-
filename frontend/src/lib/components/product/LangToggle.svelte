<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let value: 'pt' | 'en' = 'pt';
  const dispatch = createEventDispatcher();

  function set(v: 'pt' | 'en') {
    value = v;
    dispatch('change', { value });
  }
</script>

<div class="lang-toggle">
  <button type="button" class:active={value === 'pt'} on:click={() => set('pt')}>🇧🇷 PT</button>
  <button type="button" class:active={value === 'en'} on:click={() => set('en')}>🇺🇸 EN</button>
</div>

<style>
  .lang-toggle {
    display: flex;
    gap: 4px;
    background: #09090b;
    padding: 2px;
    border-radius: 6px;
  }
  button {
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 9px;
    font-weight: 700;
    color: #71717a;
  }
  button.active {
    background: #27272a;
    color: #e4e4e7;
  }
</style>
