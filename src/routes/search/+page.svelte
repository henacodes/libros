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
	import BookSkeleton from '$lib/components/BookSkeleton.svelte';
	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
	import { toast } from 'svelte-sonner';

	export let data;

	// state
	let searchResults: Book[];
	let query = '';
	let totalPages: number;
	let currentPage: number;
	let filterBy: string;
	let error: string;
	$: {
		if (data) {
			searchResults = data.searchResults;
			query = data.query || '';
			filterBy = data.filterBy!;
			totalPages = data.totalPages || 0;
			currentPage = parseInt(data.currentPage || '') || 1;
			if (data.error) {
				error = data.error;
				toast(error);
			}
			// this is usefull to stop loading after searching on the search page itself
			// which is here
			toggleLoading(false);
		}
	}

	const preceedToPage = (pageNumber: number) => {
		searchResults = [];
		toggleLoading();
		goto(`/search?query=${query}&filterBy=${filterBy || 'title'}&page=${pageNumber}`);
		currentPage = pageNumber;
	};

	onMount(() => {
		toggleLoading(false);
	});
</script>

<div class=" h-full w-full p-5 lg:px-[5rem]">
	<div class=" flex items-center justify-between">
		<div class="flex items-center">
			<a href="/"
				><Button variant="outline" size="icon">
					<ChevronLeft class="h-4 w-4" />
				</Button></a
			>
			<ThemeSwitch className="mx-3" />
		</div>

		<p class=" my-3 flex items-center text-lg">
			<span class=" mx-4">Search results for</span>
			<Badge>{query}</Badge>
		</p>
	</div>
	<SearchBar onSubmit={() => (searchResults = [])} />
	{#if searchResults.length == 0 && !$globalStore.loading}
		<div class=" h-full w-full">
			<p class=" m-4 text-center text-3xl">Looks like we got no books for this search</p>
		</div>
	{/if}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
		{#each searchResults as book, i (i)}
			<BookUI {book} />
		{/each}

		{#if $globalStore.loading && searchResults.length < 1}
			<BookSkeleton />
			<BookSkeleton />
			<BookSkeleton />
			<BookSkeleton />
			<BookSkeleton />
			<BookSkeleton />
		{/if}
	</div>
	<div class=" ">
		{#if totalPages && searchResults}
			<Pagination.Root
				class="my-5    "
				count={totalPages * 25}
				perPage={25}
				let:pages
				let:currentPage
			>
				<Pagination.Content class="flex flex-col items-center   sm:flex-row">
					<Pagination.Item>
						{#if currentPage}
							<Pagination.PrevButton on:click={() => preceedToPage(currentPage - 1)} />
						{/if}
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
						{#if currentPage}
							<Pagination.NextButton on:click={() => preceedToPage(currentPage + 1)} />
						{/if}
					</Pagination.Item>
				</Pagination.Content>
			</Pagination.Root>
		{/if}
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
