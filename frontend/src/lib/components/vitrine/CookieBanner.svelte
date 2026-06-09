<script lang="ts">
  import { onMount } from 'svelte';
  import { lang } from '$lib/stores/lang';
  import { CONSENT_KEY, cookieI18n, getConsent, setConsent } from './cookie-banner';

  let visible = false;
  let leaving = false;

  onMount(() => {
    if (getConsent(localStorage) === null) {
      visible = true;
    }
  });

  function dismiss(value: 'accepted' | 'rejected') {
    leaving = true;
    setConsent(localStorage, value);
    setTimeout(() => {
      visible = false;
      leaving = false;
    }, 220);
  }

  $: t = cookieI18n[$lang];
</script>

{#if visible}
  <div
    class="cookie-banner"
    class:leaving
    role="region"
    aria-label={$lang === 'en' ? 'Cookie consent' : 'Consentimento de cookies'}
    aria-live="polite"
    data-testid="cookie-banner"
  >
    <div class="banner-left">
      <img src="/assets/cookie.png" alt="cookie" class="cookie-icon" aria-hidden="true" />
      <p class="message">
        {t.messagePre}<a href="/cookies" class="policy-link">{t.linkText}</a>{t.messagePost}
      </p>
    </div>
    <div class="actions">
      <button class="btn-accept" on:click={() => dismiss('accepted')} data-consent={CONSENT_KEY}
        >{t.accept}</button
      >
      <button class="btn-reject" on:click={() => dismiss('rejected')}>{t.reject}</button>
    </div>
  </div>
{/if}

<style>
  .cookie-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    background: var(--bg);
    background-color: rgb(255, 255, 255);
    border-top: 1px solid rgb(166, 166, 166);
    border: 1px solid rgb(166, 166, 166);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 40px;
    animation: slide-in 280ms ease-out;
  }

  .cookie-banner.leaving {
    animation: slide-out 220ms ease-in forwards;
  }

  @keyframes slide-in {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slide-out {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100%);
    }
  }

  .banner-left {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  .cookie-icon {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    object-fit: contain;
    opacity: 0.8;
  }

  .message {
    font-size: 13.5px;
    color: var(--text-muted);
    line-height: 1.55;
    max-width: 72ch;
    margin: 0;
  }

  .policy-link {
    color: var(--venom);
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-thickness: 1px;
    transition: opacity 0.15s;
  }

  .policy-link:hover {
    opacity: 0.7;
  }

  .actions {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
  }

  .btn-accept {
    background: var(--venom);
    color: #fff;
    border: none;
    border-radius: 999px;
    padding: 9px 22px;
    font-size: 13.5px;
    font-family: inherit;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s;
    white-space: nowrap;
  }

  .btn-accept:hover {
    opacity: 0.82;
  }

  .btn-reject {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 9px 22px;
    font-size: 13.5px;
    font-family: inherit;
    font-weight: 500;
    cursor: pointer;
    transition:
      border-color 0.15s,
      color 0.15s;
    white-space: nowrap;
  }

  .btn-reject:hover {
    border-color: var(--line-strong);
    color: var(--text);
  }

  @media (max-width: 767px) {
    .cookie-banner {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      padding: 16px 20px;
    }

    .banner-left {
      align-items: flex-start;
    }

    .actions {
      width: 100%;
    }

    .btn-accept,
    .btn-reject {
      flex: 1;
      text-align: center;
      justify-content: center;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cookie-banner,
    .cookie-banner.leaving {
      animation: none;
    }
  }
</style>
