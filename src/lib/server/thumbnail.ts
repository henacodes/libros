import { JSDOM } from 'jsdom';

// Function to extract the image URL from HTML
export function extractImageUrl(html: string): string | null {
	const dom = new JSDOM(html);
	const imgElement = dom.window.document.querySelector('img') as HTMLImageElement;
	if (!imgElement) {
		console.log('this book no thumbnail');
		console.log(dom.window.document.body.outerHTML);
	}
	return imgElement ? imgElement.src : null;
}
// Function to convert relative URL to absolute URL
export function toAbsoluteUrl(relativeUrl: string | null, baseUrl: string): string | null {
	return relativeUrl ? new URL(relativeUrl, baseUrl).href : null;
}

export async function fetchThumbnail(mirror: string): Promise<string | null> {
	const response = await fetch(`/api/html?url=${mirror}`);
	let json = await response.json();
	let html = json.text;
	const relativeImgUrl = extractImageUrl(html);
	const absoluteImgUrl = toAbsoluteUrl(relativeImgUrl, new URL(mirror).origin);
	console.log('origin ', new URL(mirror).origin);
	console.log('absolute', absoluteImgUrl);
	console.log('relative', relativeImgUrl);
	return absoluteImgUrl;
}
