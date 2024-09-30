<script lang="ts">
	import type Book from '$lib/types/Book';
	import * as Dialog from '$lib/components/ui/dialog';

	import { toggleLoading } from '../../store/globalStore';
	import { ArrowLeft, ChevronLeft } from 'lucide-svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { onMount } from 'svelte';

	import BookUI from '$lib/components/BookUI.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import DownloadProgress from '$lib/components/DownloadProgress.svelte';
	import downloadStore from '$store/downloadStore';
	import SearchBar from '$lib/components/SearchBar.svelte';
	export let data;

	let searchResults: Book[];
	let query = '';
	$: {
		if (data) {
			searchResults = data.searchResults;
			query = data.query || '';

			// this is usefull to stop loading after searching on the search page itself
			// which is here
			toggleLoading(false);
		}
	}

	onMount(() => {
		toggleLoading(false);
	});
</script>

<div class=" w-full p-5 lg:px-[5rem]">
	<div class=" flex items-center justify-between">
		<a href="/"
			><Button variant="outline" size="icon">
				<ChevronLeft class="h-4 w-4" />
			</Button></a
		>

		<p class=" my-3 flex items-center text-lg">
			<span class=" mx-4">Search results for</span>
			<Badge>{query}</Badge>
		</p>
	</div>
	<SearchBar />

	{#if searchResults.length == 0}
		<p class=" m-4 text-2xl">Looks like we got no books for this search</p>
	{/if}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
		{#each searchResults as book, i (i)}
			<BookUI {book} />
		{/each}
	</div>
</div>

<Dialog.Root>
	<Dialog.Trigger class="w-full" on:click={() => {}}>
		<Button class="fixed bottom-5 right-5">Downloads ( {$downloadStore.downloads.length} )</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<DownloadProgress />
	</Dialog.Content>
</Dialog.Root>
