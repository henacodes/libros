<script lang="ts">
	import type Book from '$lib/types/Book';

	import { toggleLoading } from '../../store/globalStore';

	import axios, { type AxiosProgressEvent } from 'axios';
	import DownloadProgress from '$lib/components/DownloadProgress.svelte';
	import { addDownload, updateDownloadStatus } from '../../store/downloadStore';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { API_SERVER_URL } from '$lib/constants';
	import BookUI from '$lib/components/BookUI.svelte';
	export let data;

	let searchResults: Book[];
	let query = '';
	$: {
		if (data) {
			searchResults = data.searchResults;
			query = data.query || '';
		}
	}

	onMount(() => {
		toggleLoading(false);
	});
</script>

<div class=" w-full p-5 md:px-[5rem]">
	<p class=" my-3 flex items-center text-lg">
		<span class=" mx-4">Search results for</span>
		<Badge>{query}</Badge>
	</p>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
		{#each searchResults as book, i (i)}
			<BookUI {book} />
		{/each}
	</div>
</div>
