<script lang="ts">
  import { apiFetch } from '$lib/api/backend';

  type ProfileData = {
    id: string;
    name: string;
    email: string;
    role: string;
    display_role: string | null;
    status: string;
    phone: string | null;
    bio: string | null;
    avatar_url: string | null;
    permissions: Record<string, string[]> | null;
  };

  let {
    isOpen = false,
    profile,
    onClose,
    onSave,
  } = $props<{
    isOpen: boolean;
    profile: ProfileData;
    onClose: () => void;
    onSave: (updated: ProfileData) => void;
  }>();

  let name = $state('');
  let phone = $state('');
  let bio = $state('');
  let loading = $state(false);
  let errorMessage = $state('');
  let successMessage = $state('');

  $effect(() => {
    if (isOpen) {
      name = profile.name ?? '';
      phone = profile.phone ?? '';
      bio = profile.bio ?? '';
      errorMessage = '';
      successMessage = '';
    }
  });

  let initials = $derived(
    (name || profile.name || 'A')
      .split(' ')
      .map((n: string) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  );

  let statusLabel = $derived(profile.status === 'active' ? 'ativo' : 'inativo');
  let roleLabel = $derived(profile.display_role ?? profile.role ?? 'member');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMessage = '';
    successMessage = '';

    const trimmedName = name.trim();
    if (!trimmedName) {
      errorMessage = 'Nome de exibição é obrigatório.';
      return;
    }

    loading = true;
    try {
      const updated = await apiFetch<ProfileData>('/profile/me', {
        method: 'PATCH',
        body: JSON.stringify({
          name: trimmedName,
          phone: phone.trim() || null,
          bio: bio.trim() || null,
        }),
      });
      successMessage = 'Perfil atualizado com sucesso!';
      onSave(updated);
      setTimeout(() => onClose(), 800);
    } catch (err: unknown) {
      errorMessage =
        err instanceof Error ? err.message : 'Falha ao salvar perfil. Tente novamente.';
    } finally {
      loading = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && !loading) onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div class="admin-overlay" role="presentation" onclick={onClose}>
    <div
      class="admin-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <header class="admin-modal-head">
        <h3 id="profile-modal-title">Meu perfil</h3>
        <span class="crumbs">/ todos podem editar</span>
        <button class="x" type="button" onclick={onClose} disabled={loading} aria-label="Fechar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      <form onsubmit={handleSubmit}>
        <div class="admin-modal-body">
          <!-- avatar + identity block -->
          <div class="profile-hero">
            <div class="profile-avatar">
              {#if profile.avatar_url}
                <img src={profile.avatar_url} alt="Foto de perfil" />
              {:else}
                <span>{initials}</span>
              {/if}
            </div>
            <div class="profile-meta">
              <div class="profile-name">{profile.name}</div>
              <div class="profile-email mono">{profile.email}</div>
              <div class="profile-pills">
                <span class="status-pill" class:active={profile.status === 'active'}>
                  <span class="dt"></span>
                  {statusLabel}
                </span>
                <span class="status-pill role-pill">
                  <span class="dt role-dt"></span>
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>

          {#if errorMessage}
            <div class="error-banner" role="alert">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{errorMessage}</span>
            </div>
          {/if}

          {#if successMessage}
            <div class="success-banner" role="status">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>{successMessage}</span>
            </div>
          {/if}

          <div class="fld-group">
            <div class="fld-row">
              <div class="fld">
                <label for="p-name">Nome de exibição</label>
                <input
                  type="text"
                  id="p-name"
                  bind:value={name}
                  required
                  disabled={loading}
                  placeholder="ex. Marina Pereira"
                />
              </div>
              <div class="fld">
                <label for="p-phone">Telefone</label>
                <input
                  type="tel"
                  id="p-phone"
                  bind:value={phone}
                  disabled={loading}
                  placeholder="+55 11 9 9999-0000"
                />
              </div>
            </div>

            <div class="fld">
              <label for="p-email">E-mail corporativo</label>
              <input type="email" id="p-email" value={profile.email} disabled class="readonly" />
              <span class="fld-hint">O e-mail não pode ser alterado por aqui.</span>
            </div>

            <div class="fld">
              <label for="p-bio">Bio curta</label>
              <textarea
                id="p-bio"
                bind:value={bio}
                disabled={loading}
                rows="3"
                placeholder="Como você descreve seu trabalho na Crianex?"
              ></textarea>
            </div>

            <div class="section-divider"></div>

            <div class="security-row">
              <div>
                <div class="sec-title">Senha</div>
                <div class="sec-sub">Última alteração há 38 dias</div>
              </div>
              <button type="button" class="btn ghost sm" disabled>Alterar senha</button>
            </div>

            <div class="security-row">
              <div>
                <div class="sec-title">Autenticação 2FA</div>
                <div class="sec-sub">Recomendado · App autenticador</div>
              </div>
              <button type="button" class="toggle on" aria-label="2FA ativado" disabled></button>
            </div>

            <div class="security-row">
              <div>
                <div class="sec-title">Notificações por e-mail</div>
                <div class="sec-sub">Resumo diário às 9h</div>
              </div>
              <button type="button" class="toggle on" aria-label="Notificações ativadas" disabled
              ></button>
            </div>
          </div>
        </div>

        <footer class="admin-modal-foot">
          <button type="button" class="btn ghost sm" onclick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" class="btn sm" disabled={loading}>
            {#if loading}
              Salvando…
            {:else}
              Salvar alterações
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            {/if}
          </button>
        </footer>
      </form>
    </div>
  </div>
{/if}

<style>
  .profile-hero {
    display: flex;
    gap: 18px;
    align-items: center;
    margin-bottom: 20px;
  }

  .profile-avatar {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--purple);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    flex-shrink: 0;
    overflow: hidden;
  }

  .profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .profile-meta {
    flex: 1;
    min-width: 0;
  }

  .profile-name {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: -0.015em;
  }

  .profile-email {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 3px;
    font-family: var(--font-mono);
  }

  .profile-pills {
    display: flex;
    gap: 6px;
    margin-top: 8px;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-family: var(--font-mono);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 100px;
    background: rgba(102, 223, 122, 0.12);
    color: var(--pos-deep);
  }

  .status-pill .dt {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--green);
    flex-shrink: 0;
  }

  .role-pill {
    background: rgba(127, 63, 229, 0.1);
    color: var(--purple);
  }

  .role-dt {
    background: var(--purple) !important;
  }

  .error-banner {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 8px;
    padding: 10px 12px;
    color: #ef4444;
    font-size: 13px;
    line-height: 1.4;
    margin-bottom: 12px;
  }

  .success-banner {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background: rgba(102, 223, 122, 0.1);
    border: 1px solid rgba(102, 223, 122, 0.3);
    border-radius: 8px;
    padding: 10px 12px;
    color: var(--pos-deep);
    font-size: 13px;
    line-height: 1.4;
    margin-bottom: 12px;
  }

  .fld-hint {
    font-size: 11.5px;
    color: var(--text-faint);
    margin-top: 3px;
    display: block;
  }

  .readonly {
    color: var(--text-muted) !important;
    cursor: not-allowed;
  }

  .section-divider {
    height: 1px;
    background: var(--line);
    margin: 4px 0;
  }

  .security-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 2px 0;
  }

  .sec-title {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 2px;
  }

  .sec-sub {
    font-size: 12px;
    color: var(--text-muted);
  }

  .toggle {
    width: 40px;
    height: 22px;
    border-radius: 100px;
    border: none;
    background: var(--line);
    position: relative;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.2s;
  }

  .toggle::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .toggle.on {
    background: var(--purple);
  }

  .toggle.on::after {
    transform: translateX(18px);
  }

  .toggle:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style>
