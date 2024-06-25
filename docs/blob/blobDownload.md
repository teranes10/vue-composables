# Blob Download Function

## Overview

The `blobDownload` function creates a download link for a given Blob object and triggers a download.

### `blobDownload(blob, options)`

Creates a download link for a given Blob object and triggers a download.

#### Parameters

- `blob`: The Blob object to be downloaded.
- `options`: An object containing the download options.
  - `filename`: The name of the file to be downloaded.

### Example

```typescript
const blob = new Blob(['Hello, world!'], { type: 'text/plain' })
const options: BlobDownloadOptions = { filename: 'hello.txt' }

blobDownload(blob, options)
```
