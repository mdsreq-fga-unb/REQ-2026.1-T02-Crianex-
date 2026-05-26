<script lang="ts">
  import '../../app.css';
  import { onMount } from 'svelte';

  // Shell do painel admin — issue #72 (sidebar + topbar)
  // Middleware de roles — issue #71

  onMount(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    import('$lib/api/supabase')
      .then(({ supabase }) => {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          if (session) {
            document.cookie = `access_token=${session.access_token}; path=/; max-age=${session.expires_in || 3600}; SameSite=Lax;`;
          } else {
            document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax;';
          }
        });
        subscription = data.subscription;
      })
      .catch((err) => {
        console.error('[admin layout] Failed to set auth listener:', err);
      });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  });
</script>

<div class="admin-root">
  <!-- Shell placeholder — issue #72 substituirá este layout -->
  <slot />
</div>
