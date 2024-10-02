<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Pagination from '$lib/components/ui/pagination';
	import { toggleLoading } from '$store/globalStore';

	export let totalPages;
	export let perPage;
	export let currentPage;
	export let onPreceed;
	export let query;
	export let filterBy;

	const preceedToPage = (pageNumber: number) => {
		onPreceed();
		toggleLoading();
		goto(`/search?query=${query}&filterBy=${filterBy || 'title'}&page=${pageNumber}`);
		currentPage = pageNumber;
	};
</script>

<Pagination.Root class="my-5    " count={totalPages * 25} perPage={25} let:pages let:currentPage>
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
