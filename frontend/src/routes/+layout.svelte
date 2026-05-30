<script lang="ts">
  import { ParaglideJS } from '@inlang/paraglide-sveltekit';
  import { i18n } from '$lib/i18n';
  import { lang } from '$lib/stores/lang';
  import type { LayoutData } from '@sveltejs/kit';

  let { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props();

  // Alinha o store com o idioma detectado pelo servidor via cookie.
  // $effect.pre garante que roda antes do DOM ser atualizado (SSR + navegações).
  $effect.pre(() => {
    lang.init(data.lang);
  });
</script>

<ParaglideJS {i18n} languageTag={$lang}>
  {@render children()}
</ParaglideJS>
