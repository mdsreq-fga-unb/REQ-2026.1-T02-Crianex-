<script lang="ts">
  import { lang } from '$lib/stores/lang';

  let {
    articleId,
    helpfulCount,
    notHelpfulCount,
    apiBaseUrl = '',
  } = $props<{
    articleId: string;
    helpfulCount: number;
    notHelpfulCount: number;
    apiBaseUrl?: string;
  }>();

  const STORAGE_PREFIX = 'faq_rated_';

  const t = {
    label: { pt: 'FOI ÚTIL?', en: 'WAS THIS HELPFUL?' },
    yes: { pt: '✓ Sim', en: '✓ Yes' },
    no: { pt: '✗ Não', en: '✗ No' },
    thanks: { pt: 'Obrigado pelo feedback!', en: 'Thanks for your feedback!' },
  };

  let rated = $state<'y' | 'n' | null>(null);
  let submitting = $state<boolean>(false);
  let apiTotals = $state<{ helpful: number; not_helpful: number } | null>(null);
  let totals = $derived(apiTotals ?? { helpful: helpfulCount, not_helpful: notHelpfulCount });

  $effect(() => {
    if (typeof sessionStorage === 'undefined') return;
    const stored = sessionStorage.getItem(STORAGE_PREFIX + articleId);
    if (stored === 'y' || stored === 'n') {
      rated = stored;
    }
  });

  async function submitRating(rating: 'y' | 'n') {
    if (rated || submitting) return;
    submitting = true;

    try {
      const res = await fetch(`${apiBaseUrl}/api/public/faq/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: articleId, rating }),
      });

      if (!res.ok) return;

      const data = await res.json();

      if (data.totals) {
        apiTotals = data.totals;
      }

      rated = rating;
      sessionStorage.setItem(STORAGE_PREFIX + articleId, rating);
    } catch {
      // Falha silenciosa
    } finally {
      submitting = false;
    }
  }
</script>

<div class="faq-rate">
  {#if rated}
    <span class="rate-label thanks">{t.thanks[$lang]}</span>
  {:else}
    <span class="rate-label">{t.label[$lang]}</span>
  {/if}

  <div class="rate-buttons">
    <button
      class="rate-btn good"
      class:on={rated === 'y'}
      disabled={rated !== null && rated !== 'y'}
      aria-pressed={rated === 'y'}
      onclick={() => submitRating('y')}
    >
      {t.yes[$lang]}
    </button>
    <button
      class="rate-btn bad"
      class:on={rated === 'n'}
      disabled={rated !== null && rated !== 'n'}
      aria-pressed={rated === 'n'}
      onclick={() => submitRating('n')}
    >
      {t.no[$lang]}
    </button>
  </div>

  <div class="rate-counts">
    <span class="rating-count">👍 {totals.helpful}</span>
    <span class="rating-count">👎 {totals.not_helpful}</span>
  </div>
</div>

<style>
  .faq-rate {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--line);
  }

  .rate-label {
    font-family: var(--font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-faint);
  }

  .rate-label.thanks {
    color: var(--green, #10b981);
    text-transform: none;
    letter-spacing: normal;
    font-family: inherit;
    font-size: 13px;
  }

  .rate-buttons {
    display: flex;
    gap: 8px;
  }

  .rate-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: var(--bg-elev);
    color: var(--text-muted);
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    transition:
      background-color 0.15s,
      color 0.15s,
      border-color 0.15s;
  }

  .rate-btn:hover:not(:disabled) {
    border-color: var(--line-strong);
    color: var(--text);
  }

  .rate-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .rate-btn.good.on {
    background-color: rgba(16, 185, 129, 0.12);
    color: var(--pos-deep, #047857);
    border-color: rgba(16, 185, 129, 0.3);
    opacity: 1;
  }

  .rate-btn.bad.on {
    background-color: var(--hot-soft, rgba(231, 31, 132, 0.1));
    color: var(--pink, #e71f84);
    border-color: rgba(231, 31, 132, 0.3);
    opacity: 1;
  }

  .rate-counts {
    display: flex;
    gap: 8px;
    margin-left: auto;
  }

  .rating-count {
    font-size: 13px;
    color: var(--text-muted);
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  @media (max-width: 480px) {
    .faq-rate {
      gap: 10px;
    }

    .rate-counts {
      margin-left: 0;
      width: 100%;
    }
  }
</style>
