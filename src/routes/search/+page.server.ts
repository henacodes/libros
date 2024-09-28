import type { RequestHandler } from '@sveltejs/kit';

export const load = async ({ url, fetch }) => {
	const query = url.searchParams.get('query');

	if (!query) {
		return new Response(JSON.stringify({ error: 'Query parameter is missing' }), { status: 400 });
	}

	const response = await fetch(`/api/search?q=${query}`);

	const data = await response.json();

	return {
		query,
		searchResults: data
	};
};
