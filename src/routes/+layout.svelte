<script lang="ts">
	// svelte core

	// third party

	// shadcdn components
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';

	// custom components
	import GlobalLoading from '$lib/components/GlobalLoading.svelte';
	import '../app.css';

	// custom types

	// stores
	import globalStore from '../store/globalStore';
	import { onMount } from 'svelte';
	import { DOWNLOAD_HISTORY } from '$lib/constants';
	import { addDownloadHistory } from '$store/downloadStore';
	import type { BookDownload } from '$lib/types/Book';

	onMount(() => {
		if (window) {
			let storage = localStorage.getItem(DOWNLOAD_HISTORY);
			if (storage !== '' && storage !== null) {
				let downloads = JSON.parse(storage!);

				if (Array.isArray(downloads)) {
					addDownloadHistory(downloads);
				}
			}
		}
	});
</script>

<ModeWatcher />

<div class="bg-background">
	<slot />
</div>

<Toaster />
{#if $globalStore.loading}
	<GlobalLoading />
{/if}
