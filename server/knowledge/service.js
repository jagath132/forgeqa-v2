import crypto from 'node:crypto';
import { chunkText } from './chunker.js';
import { extractTextFromBuffer, extractTextFromFile, getFileType } from './parsers.js';
import { createEmbeddings } from '../ai/embeddings.js';

export function createKnowledgeService(store, env = {}) {
  function withoutExtractedText(file) {
    const publicFile = { ...file };
    delete publicFile.extracted_text;
    return publicFile;
  }

  async function saveExtractedKnowledge(
    {
      fileName,
      fileType,
      sourceType,
      text,
      pageCount,
      entities = [],
      externalId,
      externalUrl,
      modifiedAt,
    },
    userId,
    { beforeCreate } = {}
  ) {
    if (!text.trim()) {
      throw new Error(`No readable text found in ${fileName}`);
    }

    const contentHash = crypto.createHash('sha256').update(text).digest('hex');
    const fileData = {
      user_id: userId || env.DEFAULT_USER_ID || 'local-user',
      file_name: fileName,
      file_type: fileType,
      source_type: sourceType,
      status: 'needs_chunking',
      extracted_text: text,
      page_count: pageCount,
      entities,
      external_id: externalId,
      external_url: externalUrl,
      modified_at: modifiedAt,
      last_synced_at: new Date().toISOString(),
      content_hash: contentHash,
    };
    const existing = externalId
      ? await store.findFileByExternalId(sourceType, externalId, userId)
      : null;
    if (existing?.content_hash === contentHash) return null;
    if (!existing && beforeCreate) await beforeCreate();
    if (existing) await store.clearFileChunks(existing.id, userId);
    const file = existing
      ? await store.updateFile(existing.id, fileData, userId)
      : await store.createFile(fileData);

    return withoutExtractedText({
      ...file,
      status: 'needs_chunking',
      chunk_count: 0,
    });
  }

  return {
    saveExtractedKnowledge,
    async syncConnector(provider, documents, userId, options = {}) {
      const saved = [];
      for (const document of documents) {
        const file = await saveExtractedKnowledge(
          {
            ...document,
            sourceType: provider,
            pageCount: null,
          },
          userId,
          options
        );
        if (file) saved.push(file);
      }
      return saved;
    },
    async processUpload(file, userId) {
      const parsed = await extractTextFromFile(file);

      return saveExtractedKnowledge(
        {
          fileName: file.originalname,
          fileType: parsed.fileType,
          sourceType: 'upload',
          text: parsed.text,
          pageCount: parsed.pageCount,
          entities: parsed.entities,
        },
        userId
      );
    },

    async processSharePointUrl(url, userId) {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:') throw new Error('Only HTTPS URLs are allowed.');
      if (
        !parsed.hostname.endsWith('.sharepoint.com') &&
        !parsed.hostname.endsWith('.sharepoint.cn')
      ) {
        throw new Error('Only SharePoint domains are allowed.');
      }

      const isAllowedHost = (hostname) => {
        const host = hostname.toLowerCase().replace(/\.$/, '');
        return host.endsWith('.sharepoint.com') || host.endsWith('.sharepoint.cn');
      };

      const headers = {};
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        let requestUrl = parsed;
        let response;
        for (let redirects = 0; redirects <= 3; redirects += 1) {
          if (!isAllowedHost(requestUrl.hostname)) throw new Error('SharePoint redirected to an unapproved host.');
          response = await fetch(requestUrl, { headers, signal: controller.signal, redirect: 'manual' });
          if (![301, 302, 303, 307, 308].includes(response.status)) break;
          const location = response.headers.get('location');
          if (!location || redirects === 3) throw new Error('SharePoint redirect limit exceeded.');
          requestUrl = new URL(location, requestUrl);
          if (requestUrl.protocol !== 'https:' || !isAllowedHost(requestUrl.hostname)) {
            throw new Error('SharePoint redirected to an unapproved URL.');
          }
        }
        clearTimeout(timeout);

        const contentLength = Number(response.headers.get('content-length') || 0);
        const maxBytes = 25 * 1024 * 1024;
        if (contentLength > maxBytes) throw new Error('SharePoint document exceeds the 25 MB limit.');

        if (!response.ok) {
          throw new Error(
            `Unable to fetch SharePoint document (${response.status}). Please check the URL and file permissions.`
          );
        }

        const parts = [];
        let totalBytes = 0;
        for await (const part of response.body) {
          totalBytes += part.length;
          if (totalBytes > maxBytes) throw new Error('SharePoint document exceeds the 25 MB limit.');
          parts.push(part);
        }
        const buffer = Buffer.concat(parts);
        const fileName = decodeURIComponent(
          url.split('/').pop()?.split('?')[0] || 'sharepoint-document'
        );
        const fileType = getFileType(fileName, response.headers.get('content-type') ?? '');
        const parsed = await extractTextFromBuffer(buffer, {
          fileName,
          fileType,
          mimeType: response.headers.get('content-type') ?? '',
        });

        return saveExtractedKnowledge(
          {
            fileName,
            fileType,
            sourceType: 'sharepoint',
            text: parsed.text,
            pageCount: parsed.pageCount,
            entities: parsed.entities,
          },
          userId
        );
      } catch (fetchErr) {
        clearTimeout(timeout);
        if (fetchErr.name === 'AbortError') throw new Error('SharePoint request timed out.');
        throw fetchErr;
      }
    },

    listFiles(search, userId) {
      return store.listFiles(search, userId);
    },

    async deleteFile(id, userId) {
      return store.deleteFile(id, userId);
    },

    async refreshChunks(userId, { provider, apiKey } = {}) {
      const files = await store.listChunkableFiles(userId);
      let chunkCount = 0;

      for (const file of files) {
        const chunks = chunkText(file.extracted_text, {
          pageNumber: file.page_count ? 1 : null,
          entities: file.entities ?? [],
        });

        if (!chunks.length) {
          await store.updateFile(
            file.id,
            {
              status: 'failed',
              chunk_count: 0,
            },
            userId
          );
          continue;
        }

        if (!provider || !apiKey) {
          throw new Error('Select an AI provider with a configured API key to create embeddings.');
        }
        const vectors = [];
        for (let offset = 0; offset < chunks.length; offset += 64) {
          const batch = chunks.slice(offset, offset + 64);
          vectors.push(
            ...(await createEmbeddings({
              apiKey,
              provider,
              inputs: batch.map((chunk) => chunk.chunk_text),
            }))
          );
        }
        chunks.forEach((chunk, index) => {
          chunk.embedding = vectors[index];
        });
        await store.replaceChunks(file.id, chunks, userId);
        chunkCount += chunks.length;
      }

      return {
        fileCount: files.length,
        chunkCount,
      };
    },

    async searchChunks(query, limit, userId, fileId, embeddingOptions = {}) {
      let queryEmbedding = null;
      if (embeddingOptions.provider && embeddingOptions.apiKey) {
        [queryEmbedding] = await createEmbeddings({
          ...embeddingOptions,
          embeddingTaskType: 'RETRIEVAL_QUERY',
          inputs: [query],
        });
      }
      return store.searchChunks(query, limit, userId, fileId, queryEmbedding);
    },
  };
}
