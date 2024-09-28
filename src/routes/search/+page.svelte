<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type Book from '$lib/types/Book';
	import Button from '$lib/components/ui/button/button.svelte';
	import { downloadBlob } from '$lib/utils';
	import * as Dialog from '$lib/components/ui/dialog';

	import axios from 'axios';
	import DownloadProgress from '$lib/components/DownloadProgress.svelte';
	import DialogContent from '$lib/components/ui/dialog/dialog-content.svelte';
	import downloadStore, { addDownload, updateDownloadStatus } from '../../store/downloadStore';
	export let data;

	let searchResults: Book[];
	$: {
		if (data) {
			searchResults = data.searchResults;
			console.log(searchResults);
		}
	}

	const handleDownload = async (book: Book) => {
		try {
			let options = {};

			addDownload(book);
			const res = await axios.post('http://localhost:3000/books/download', book, {
				responseType: 'blob', // Set response type to blob
				onDownloadProgress: (progressEvent: ProgressEvent) => {
					const total = progressEvent.total;
					const loaded = progressEvent.loaded;

					updateDownloadStatus(book, loaded, total);
					console.log('loaded', loaded, 'total:', progressEvent);
				}
			});

			if (res) {
				let blob = res.data;
				downloadBlob(blob, book.title, book.extension);
			}
		} catch (error) {
			console.log(error);
		}
	};
</script>

<div class=" w-full p-5 px-[2rem]">
	<Table.Root>
		<Table.Caption>A list of recent books.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[100px]">ID</Table.Head>
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
					<Table.Cell class="font-medium">{book.id}</Table.Cell>
					<Table.Cell>{book.authors}</Table.Cell>
					<Table.Cell>{book.title}</Table.Cell>
					<Table.Cell>{book.year}</Table.Cell>
					<Table.Cell class="text-right">{book.size}</Table.Cell>
					<Table.Cell class="text-right">{book.extension}</Table.Cell>
					<Table.Cell>
						<Dialog.Root>
							<Dialog.Trigger on:click={() => handleDownload(book)}>Download</Dialog.Trigger>
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
