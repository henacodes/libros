import express from "express";
import { getDocument } from "./document";
import { parseDownloadUrls } from "./url";
import { downloadFile } from "./download";
import { createMD5ListFile } from "./file";

const router = express.Router();

// Search for a book
router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const searchURL = `https://example-book-search-api.com/search?q=${encodeURIComponent(query)}`;
    const document = await getDocument(searchURL);
    const downloadUrls = parseDownloadUrls(document);

    if (!downloadUrls || downloadUrls.length === 0) {
      return res.status(404).json({ error: "No download links found" });
    }

    res.json({ downloadUrls });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching for the book" });
  }
});

// Download a book
router.get("/download", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Download URL is required" });
  }

  try {
    const downloadStream = await fetch(url as string);

    const downloadResult = await downloadFile({
      downloadStream,
      onStart: (filename, total) => {
        console.log(`Started downloading ${filename}, total size: ${total} bytes`);
      },
      onData: (filename, chunk, total) => {
        console.log(`Downloading ${filename}: ${chunk.length} bytes received`);
      },
    });

    // Create MD5 list file (assuming you want to do this for each download)
    const md5ListFile = await createMD5ListFile([downloadResult.filename]);

    res.json({
      message: "Download completed successfully",
      downloadResult,
      md5ListFile,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while downloading the book" });
  }
});

export default router;
