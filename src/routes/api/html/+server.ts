import { extractImageUrl, toAbsoluteUrl } from '$lib/server/thumbnail';
import { json } from '@sveltejs/kit';
import http from 'http';

export async function GET({ url }) {
	let mirrorUrl = url.searchParams.get('url');
	if (!mirrorUrl) {
		return json({ error: 'Url must be provided' }, { status: 400 });
	}
	const response = await fetchHtml(mirrorUrl);

	const relativeUrl = extractImageUrl(response);
	const imgUrl = toAbsoluteUrl(relativeUrl, mirrorUrl);

	return json({ url: imgUrl }, { status: 200 });
}

function fetchHtml(url: string): Promise<string> {
	return new Promise((resolve, reject) => {
		http
			.get(url, (res) => {
				let data = '';
				res.on('data', (chunk) => {
					data += chunk;
				});
				res.on('end', () => {
					resolve(data);
				});
			})
			.on('error', (err) => {
				reject(err);
			});
	});
}
