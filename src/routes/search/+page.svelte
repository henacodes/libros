<script lang="ts">
	import type Book from '$lib/types/Book';
	import * as Dialog from '$lib/components/ui/dialog';

	import { toggleLoading } from '../../store/globalStore';
	import { ArrowLeft } from 'lucide-svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { onMount } from 'svelte';

	import BookUI from '$lib/components/BookUI.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import DownloadProgress from '$lib/components/DownloadProgress.svelte';
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
	<div class=" flex justify-between">
		<a href="/"><ArrowLeft /></a>
		<p class=" my-3 flex items-center text-lg">
			<span class=" mx-4">Search results for</span>
			<Badge>{query}</Badge>
		</p>
	</div>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
		{#each searchResults as book, i (i)}
			<BookUI {book} />
		{/each}
	</div>
</div>

<Dialog.Root>
	<Dialog.Trigger class="w-full" on:click={() => {}}>
		<Button class="fixed bottom-5 right-5">Downloads</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<DownloadProgress />
	</Dialog.Content>
</Dialog.Root>
