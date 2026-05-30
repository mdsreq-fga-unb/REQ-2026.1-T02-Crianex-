<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let published: boolean = false;
  const dispatch = createEventDispatcher();

  function set(v: boolean) {
    published = v;
    dispatch('change', { published });
  }
</script>

<div class="grid grid-cols-2 gap-3">
  <button type="button" class:active={published} on:click={() => set(true)}>
    <div>Publicado</div>
    <div class="text-sm text-zinc-500">Visível na vitrine pública</div>
  </button>
  <button type="button" class:active={!published} on:click={() => set(false)}>
    <div>Rascunho</div>
    <div class="text-sm text-zinc-500">Salvo, oculto do público</div>
  </button>
</div>

<style>
  button {
    display: flex;
    gap: 8px;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #2a2a2a;
    background: #09090b;
  }
  button.active {
    border-color: rgba(16, 185, 129, 0.3);
    background: rgba(16, 185, 129, 0.04);
  }
</style>
