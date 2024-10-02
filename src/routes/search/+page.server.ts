import { API_SERVER_URL } from '$lib/constants.js';

export const load = async ({ url, fetch }) => {
	const query = url.searchParams.get('query');
	const filterBy = url.searchParams.get('filterBy');
	const currentPage = url.searchParams.get('page');
	if (!query) {
		return new Response(JSON.stringify({ error: 'Query parameter is missing' }), { status: 400 });
	}

	const response = await fetch(
		`${API_SERVER_URL}/books/search?query=${query}&filterBy=${filterBy}&page=${currentPage}`
	);

	const serverResponse = await response.json();
	return {
		query,
		currentPage,
		searchResults: serverResponse.data.searchResults,
		filterBy,
		totalPages: serverResponse.data.totalPages,
		error: serverResponse.error
	};
};
