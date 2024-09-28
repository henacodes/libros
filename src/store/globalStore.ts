import { writable } from 'svelte/store';

const globalStore = writable({ loading: false });

export const toggleLoading = (state?: boolean) =>
	globalStore.update((curr) => ({
		...curr,
		loading: typeof state === 'boolean' ? state : !curr.loading
	}));

export default globalStore;
