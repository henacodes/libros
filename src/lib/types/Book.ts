export default interface Book {
	id: string;
	authors: string;
	title: string;
	publisher: string;
	year: string;
	pages: string;
	language: string;
	size: string;
	extension: string;
	mirror: string;
}

export interface BookDownload extends Book {
	loaded: number;
	total: number;
	done?: boolean;
}
