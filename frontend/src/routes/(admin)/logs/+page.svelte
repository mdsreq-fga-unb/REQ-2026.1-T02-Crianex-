<script>
  import { Wrench } from 'lucide-svelte';
</script>

<div class="dev-placeholder">
  <Wrench size={28} />
  <h2>Em desenvolvimento</h2>
  <p>Esta seção ainda não está disponível.</p>
</div>

<style>
  .dev-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 60vh;
    color: var(--text-muted);
  }
  .dev-placeholder h2 {
    font-size: 16px;
    font-weight: 500;
    color: var(--text);
    margin: 0;
  }
  .dev-placeholder p {
    font-size: 13px;
    color: var(--text-faint);
    margin: 0;
  }
</style>
