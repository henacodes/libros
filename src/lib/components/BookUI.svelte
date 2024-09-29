<script lang="ts">
	import type Book from '$lib/types/Book';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	import Button from './ui/button/button.svelte';
	import { CalendarDays } from 'lucide-svelte';
	import { API_SERVER_URL } from '$lib/constants';
	import { addDownload, updateDownloadStatus } from '../../store/downloadStore';
	import axios, { type AxiosProgressEvent } from 'axios';
	import { toast } from 'svelte-sonner';
	import { downloadBlob } from '$lib/utils';
	export let book: Book;
	import * as Dialog from '$lib/components/ui/dialog';
	import DownloadProgress from './DownloadProgress.svelte';

	let thumbUrl = '';

	let defaultImage = 'https://library.lol/img/blank.png';

	const handleDownload = async (book: Book) => {
		try {
			addDownload(book);
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
				downloadBlob(blob, book.title, book.extension);
			}
		} catch (error) {
			console.log(error);
		}
	};

	onMount(() => {
		if (book && browser) {
			(async () => {
				// Generate a random delay between 2000 and 3000 milliseconds
				const delay = Math.floor(Math.random() * 1000) + 3000;

				// Wait for the random delay
				await new Promise((resolve) => setTimeout(resolve, delay));

				let res = await fetch(`/api/html?url=${book.mirror}`);
				const json = await res.json();

				if (json.url) {
					book.thumbUrl = json.url;
					thumbUrl = json.url;
				}
				// Optionally, you can set book.thumbUrl here
				// book.thumbUrl = thumbUrl || undefined;
			})();
		}
	});
</script>

<div
	class="relative flex max-h-[30rem] flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md"
>
	<div
		class="relative mx-4 mt-4 h-60 overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700"
	>
		<img
			src={`${API_SERVER_URL}/proxy?url=${thumbUrl || defaultImage}`}
			alt="card-image"
			class="h-[full] w-full object-cover"
		/>
	</div>
	<div class="p-6">
		<div class="mb-2 flex items-center justify-between">
			<p
				class="text-blue-gray-900 block font-sans text-base font-medium leading-relaxed antialiased"
			>
				{book.title.replace(/\d{5,}/g, '')}
			</p>
		</div>

		<div>
			<p
				class=" text-blue-gray-900 my-1 block font-sans text-base font-medium leading-relaxed antialiased"
			>
				<span class=" font-bold">Authors :</span>
				<small>{book.authors}</small>
			</p>
			<p class="flex items-center">
				<CalendarDays size={20} /> <span class=" mx-1">{book.year}</span>
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
