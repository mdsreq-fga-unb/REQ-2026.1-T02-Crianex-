import { writable } from 'svelte/store';

// Contador global de notificações não lidas — semeado pelo (admin) layout e pela
// central; permite atualização otimista do badge na #190 (marcar como lida).
export const unreadCount = writable<number>(0);
