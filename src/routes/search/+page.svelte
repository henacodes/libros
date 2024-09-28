<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type Book from '$lib/types/Book';
	import Button from '$lib/components/ui/button/button.svelte';
	import { downloadBlob } from '$lib/utils';
	import { toggleLoading } from '../../store/globalStore';
	import * as Dialog from '$lib/components/ui/dialog';

	import axios, { type AxiosProgressEvent } from 'axios';
	import DownloadProgress from '$lib/components/DownloadProgress.svelte';
	import { addDownload, updateDownloadStatus } from '../../store/downloadStore';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	export let data;

	let searchResults: Book[];
	let query = '';
	$: {
		if (data) {
			searchResults = data.searchResults;
			query = data.query || '';
			console.log(searchResults);
		}
	}

	const handleDownload = async (book: Book) => {
		try {
			addDownload(book);
			const res = await axios.post('http://localhost:3000/books/download', book, {
				responseType: 'blob', // Set response type to blob
				onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
					// this function gets called everytime the file gets updated with a new stream
					const total = progressEvent.total;
					const loaded = progressEvent.loaded;

					updateDownloadStatus(book, loaded, total || 0);
				}
			});

			if (res) {
				let blob = res.data;
				toast('Book downloaded successfully :)');
				downloadBlob(blob, book.title, book.extension);
			}
		} catch (error) {
			console.log(error);
		}
	};

	onMount(() => {
		toggleLoading(false);
	});
</script>

<div class=" w-full p-5 px-[5rem]">
	<p class=" my-3 flex items-center text-lg">
		<span class=" mx-4">Search results for</span>
		<Badge>{query}</Badge>
	</p>
	<Table.Root>
		<Table.Caption>A list of recent books.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>Authors</Table.Head>
				<Table.Head>Title</Table.Head>
				<Table.Head>Year</Table.Head>
				<Table.Head class="text-right">Size</Table.Head>
				<Table.Head class="text-right">Extension</Table.Head>
				<Table.Head></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each searchResults as book, i (i)}
				<Table.Row>
					<Table.Cell>{book.authors}</Table.Cell>
					<Table.Cell>{book.title.replace(/\d{5,}/g, '')}</Table.Cell>
					<Table.Cell>{book.year}</Table.Cell>
					<Table.Cell class="text-right">{book.size}</Table.Cell>
					<Table.Cell class="text-right">{book.extension}</Table.Cell>
					<Table.Cell>
						<Dialog.Root>
							<Dialog.Trigger on:click={() => handleDownload(book)}
								><Button variant="secondary">Download</Button></Dialog.Trigger
							>
							<Dialog.Content>
								<DownloadProgress />
							</Dialog.Content>
						</Dialog.Root>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
