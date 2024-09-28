import { writable } from 'svelte/store';

const globalStore = writable({ loading: false });

export const toggleLoading = () =>
	globalStore.update((curr) => ({ ...curr, loading: !curr.loading }));

export default globalStore;
