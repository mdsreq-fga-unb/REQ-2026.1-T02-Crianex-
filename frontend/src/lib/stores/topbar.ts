import { writable } from 'svelte/store';

export type TopbarAction = {
  label: string;
  onClick: () => void;
};

export const topbarActions = writable<TopbarAction[]>([]);
