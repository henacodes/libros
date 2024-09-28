import {writable} from "svelte/store"
import { BookDownload } from "$lib/types/Book"
export default writable<BookDownload[]>([])