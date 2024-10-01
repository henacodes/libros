<script lang="ts">
	// svelte core
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// third party
	import { ChevronLeft } from 'lucide-svelte';

	// shadcdn components
	import Button from '$lib/components/ui/button/button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Pagination from '$lib/components/ui/pagination';

	// custom components
	import SearchBar from '$lib/components/SearchBar.svelte';
	import DownloadProgress from '$lib/components/DownloadProgress.svelte';
	import BookUI from '$lib/components/BookUI.svelte';

	// custom types
	import type Book from '$lib/types/Book';

	// stores
	import downloadStore from '$store/downloadStore';
	import globalStore, { toggleLoading } from '../../store/globalStore';

	export let data;

	// state
	let searchResults: Book[];
	let query = '';
	let totalPages: number;
	let currentPage: number;
	let filterBy: string;
	$: {
		if (data) {
			searchResults = data.searchResults;
			query = data.query || '';
			filterBy = data.filterBy!;
			totalPages = data.totalPages || 0;
			currentPage = parseInt(data.currentPage || '') || 1;

			// this is usefull to stop loading after searching on the search page itself
			// which is here
			toggleLoading(false);
		}
	}

	const preceedToPage = (pageNumber: number) => {
		searchResults = [];
		toggleLoading();
		goto(`/search?query=${query}&filterBy=${filterBy || 'title'}&page=${pageNumber}`, {
			replaceState: true
		});
		currentPage = pageNumber;
	};

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

	{#if searchResults.length == 0 && !$globalStore.loading}
		<p class=" m-4 text-2xl">Looks like we got no books for this search</p>
	{/if}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
		{#each searchResults as book, i (i)}
			<BookUI {book} />
		{/each}
	</div>
	<Pagination.Root class="my-5" count={totalPages * 25} perPage={25} let:pages let:currentPage>
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton />
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item isVisible={currentPage == page.value}>
						<Pagination.Link
							on:click={() => preceedToPage(page.value)}
							{page}
							isActive={currentPage == page.value}
						>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton />
			</Pagination.Item>
		</Pagination.Content>
	</Pagination.Root>
</div>

<Dialog.Root>
	<Dialog.Trigger class="w-full" on:click={() => {}}>
		<Button class="fixed bottom-5 right-5">Downloads ( {$downloadStore.downloads.length} )</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<DownloadProgress />
	</Dialog.Content>
</Dialog.Root>
