import type { RequestHandler } from '@sveltejs/kit';

export const load = async ({ url }) => {
	const query = url.searchParams.get('query');

	if (!query) {
		return new Response(JSON.stringify({ error: 'Query parameter is missing' }), { status: 400 });
	}

	const response = await fetch(`http://localhost:3000/books/search?q=${query}`);

	const data = await response.json();

	return {
		searchResults: data
	};
};
