import config from "../config";
import { constructSearchURL } from "../data/search";
import { attempt, findMirror } from "../utils";
import { SEARCH_PAGE_SIZE } from "../constants";
import { parseEntries } from "../data/search";
import { getDocument } from "../data/document";

export async function search(query: string, pageNumber: number) {
  let availableMirror = await findMirror(config.mirrors, (message: string) => {
    throw new Error(message);
  });
  const searchURL = constructSearchURL({
    query,
    mirror: availableMirror || "",
    pageNumber,
    pageSize: SEARCH_PAGE_SIZE,
    searchReqPattern: config.searchReqPattern,
    columnFilterQueryParamKey: config.columnFilterQueryParamKey,
    columnFilterQueryParamValue: "title", //config.selectedSearchByOption,
  });
  const pageDocument = await attempt(() => getDocument(searchURL));
  if (!pageDocument) {
    throw new Error("Couldnt find any book ");
  }
  const entries = parseEntries(pageDocument);

  return entries;
}
