import { Entry } from "../models/Entry";
import Selector from "../selectors";

export interface constructSearchURLParams {
  query: string;
  pageNumber: number;
  pageSize: number;
  mirror: string;
  searchReqPattern: string;
  columnFilterQueryParamKey: string;
  columnFilterQueryParamValue: string | null;
}
export function constructSearchURL({
  query,
  pageNumber,
  pageSize,
  mirror,
  searchReqPattern,
  columnFilterQueryParamKey,
  columnFilterQueryParamValue,
}: constructSearchURLParams): string {
  let url = searchReqPattern
    .replace("{mirror}", mirror)
    .replace("{query}", query)
    .replace("{pageNumber}", pageNumber.toString())
    .replace("{pageSize}", pageSize.toString());

  if (columnFilterQueryParamValue) {
    url += `&${columnFilterQueryParamKey}=${columnFilterQueryParamValue}`;
  }

  return url;
}

export function constructMD5SearchUrl(pattern: string, mirror: string, md5: string): string {
  return pattern.replace("{mirror}", mirror).replace("{md5}", md5);
}

export function constructFindMD5SearchUrl(
  pattern: string,
  mirror: string,
  idList: string[]
): string {
  return pattern.replace("{mirror}", mirror).replace("{id}", idList.join(","));
}

export function parseEntries(
  document: Document,
  throwError?: (message: string) => void
): Entry[] | undefined {
  const entries: Entry[] = [];
  const containerTable = document.querySelector<HTMLTableElement>(
    Selector.TABLE_CONTAINER_SELECTOR
  );

  if (!containerTable) {
    if (throwError) {
      throwError("containerTable is undefined");
    }
    return;
  }

  // Get rid of table header by slicing it
  const entryElements = Array.from(containerTable.children).slice(1);

  for (let i = 0; i < entryElements.length; i++) {
    const element = entryElements[i];

    const id = element.children[0]?.textContent || "";
    const authors = element.children[1]?.textContent || "";
    const title = element.children[2]?.textContent || "";
    const publisher = element.children[3]?.textContent || "";
    const year = element.children[4]?.textContent || "";
    const pages = element.children[5]?.textContent || "";
    const language = element.children[6]?.textContent || "";
    const size = element.children[7]?.textContent || "";
    const extension = element.children[8]?.textContent || "";
    const mirror = element.children[9]?.children[0]?.getAttribute("href") || "";

    entries.push({
      id,
      authors,
      title,
      publisher,
      year,
      pages,
      language,
      size,
      extension,
      mirror,
    });
  }

  return entries;
}
