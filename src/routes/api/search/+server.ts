import { search } from '$lib/libgen/outlets/search.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	let query = url.searchParams.get('q');
	let pageNumber = parseInt(url.searchParams.get('page') || '') || 1;

	if (!query) {
		return json({ message: 'Search query should be provided' }, { status: 400 });
	}

	let searchResults = await search(query, pageNumber);

	return json(searchResults, { status: 200 });
}
