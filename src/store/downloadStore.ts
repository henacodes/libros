import { writable } from 'svelte/store';
import type { BookDownload } from '$lib/types/Book';
import type Book from '$lib/types/Book';

const downloadStore = writable({ downloads: [] } as { downloads: BookDownload[] });

export const addDownload = (book: Book) => {
	let newDownload: BookDownload = { ...book, loaded: 0, total: 0 };
	downloadStore.update((curr) => ({
		...curr,
		downloads: [...curr.downloads, newDownload]
	}));
};

export const updateDownloadStatus = (book: Book, loaded: number, total: number, done = false) => {
	downloadStore.update((curr) => ({
		...curr,
		downloads: curr.downloads.map((b) => {
			if (book.id === b.id) {
				return {
					...b,
					loaded,
					total,
					done
				};
			}
			return b;
		})
	}));
};

export default downloadStore;
