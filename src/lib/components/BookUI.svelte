<script lang="ts">
	// shadcdn components
	import type Book from '$lib/types/Book';
	import Button from './ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	// third-party
	import { CalendarDays } from 'lucide-svelte';
	import axios, { type AxiosProgressEvent } from 'axios';
	import { toast } from 'svelte-sonner';

	//custom components
	import DownloadProgress from './DownloadProgress.svelte';

	// misc
	import { API_SERVER_URL, NOT_AVAILABLE } from '$lib/constants';
	import { downloadBlob } from '$lib/utils';

	// stores
	import downloadStore, { addDownload, updateDownloadStatus } from '../../store/downloadStore';

	export let book: Book;

	const handleDownload = async (book: Book) => {
		try {
			addDownload(book);
			console.log('selected book', book);
			const res = await axios.post(`${API_SERVER_URL}/books/download`, book, {
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
				downloadBlob(blob, $downloadStore.downloads.filter((b) => b.id === book.id)[0]);
			}
		} catch (error) {
			console.log(error);
		}
	};
</script>

<div
	class="  relative flex flex-col rounded-xl bg-background bg-clip-border text-gray-700 shadow-lg outline outline-1"
>
	<div class="relative mx-4 mt-4 text-gray-700">
		<img
			class=" h-[300px] w-full rounded-xl"
			src={`${API_SERVER_URL}/proxy?url=${book.thumbUrl}`}
			alt=""
		/>
	</div>
	<div class="  p-6 md:h-52">
		<div class="mb-2 flex items-center justify-between">
			<p class=" block font-sans text-base font-bold leading-relaxed text-primary antialiased">
				{book.title.replace(/\d{5,}/g, '').slice(0, 100)}
				{book.title.replace(/\d{5,}/g, '').length > 100 ? '....' : ''}
			</p>
		</div>

		<div>
			<p class="  text-slate-500">
				<span class=" font-bold">Authors :</span>

				{#if book.authors.length}
					<small
						>{book.authors.length > 100
							? `${book.authors.slice(0, 100)} ....`
							: book.authors}</small
					>
				{:else}
					<small>{book.authors.length && NOT_AVAILABLE}</small>
				{/if}
			</p>
			<p class="flex items-center">
				<CalendarDays size={20} /> <span class=" mx-1">{book.year || NOT_AVAILABLE}</span>
			</p>
		</div>
	</div>
	<div class="p-6 pt-0">
		<Dialog.Root>
			<Dialog.Trigger class="w-full" on:click={() => handleDownload(book)}
				><Button class=" w-full ">Download {book.extension.toUpperCase()} ( {book.size} )</Button
				></Dialog.Trigger
			>
			<Dialog.Content>
				<DownloadProgress />
			</Dialog.Content>
		</Dialog.Root>
	</div>
</div>
