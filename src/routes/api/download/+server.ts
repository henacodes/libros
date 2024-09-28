import type { Entry } from '$lib/libgen/models/Entry.js';
import downloadLink from '$lib/libgen/outlets/download';
import { json } from '@sveltejs/kit';

import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

// src/routes/api/download.js

export async function POST({ request }) {
	const entry = await request.json(); // Assuming the entry is sent as JSON

	if (!entry) {
		return json({ error: 'Bad request' }, { status: 400 });
	}

	const { downloadUrl, error } = await downloadLink(entry); // Implement this function based on your logic

	if (!downloadUrl) {
		return json(error, { status: 400 });
	}

	try {
		const response = await fetch(downloadUrl);

		// Check if the request was successful
		if (!response.ok) {
			return new Response('Failed to fetch the file.', { status: response.status });
		}

		const contentLength = response.headers.get('content-length');
		const contentType = response.headers.get('content-type') || 'application/octet-stream';

		// Set the appropriate headers for the file download
		const headers = new Headers({
			'Content-Type': contentType,
			'Content-Disposition': 'attachment; filename="downloaded-file"' // Change the filename as needed
		});

		if (contentLength) {
			headers.set('Content-Length', contentLength);
		}

		// Pipe the response body directly to the SvelteKit response
		return new Response(response.body, {
			status: 200,
			headers: headers
		});
	} catch (error) {
		console.error('Error fetching the file:', error);
		return new Response('Error downloading the file.', { status: 500 });
	}
}
