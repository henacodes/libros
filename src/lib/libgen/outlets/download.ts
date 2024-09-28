import { getDocument } from '../data/document';
import { parseDownloadUrls } from '../data/url';
import { type Entry } from '../models/Entry';
import { attempt } from '../utils';

export default async function downloadLink(entry: Entry) {
	let error = null;
	const pageDocument = await attempt(
		() => getDocument(entry.mirror),
		(message) => {
			error = message;
		}
	);
	if (!pageDocument || error) {
		return { error };
	}
	const parsedDownloadUrls = parseDownloadUrls(pageDocument, (message) => {
		error = message;
	});
	if (!parsedDownloadUrls || error) {
		return { error };
	}
	return { downloadUrl: parsedDownloadUrls[0] };
}
