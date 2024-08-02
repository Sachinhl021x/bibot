const { ChromaClient } = require('chromadb');

class LocalEmbeddings {
  constructor() {
    this.model = null;
    this.pipeline = null;
  }

  async init() {
    const { pipeline } = await import('@xenova/transformers');
    this.pipeline = pipeline;
    this.model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  async embedDocuments(documents) {
    if (!this.model) await this.init();
    const embeddings = await Promise.all(documents.map(doc => this.embedQuery(doc)));
    return embeddings;
  }

  async embedQuery(query) {
    if (!this.model) await this.init();
    const result = await this.model(query, { pooling: 'mean', normalize: true });
    return Array.from(result.data);
  }
}

const client = new ChromaClient();
const embeddings = new LocalEmbeddings();

let vectorStore;

async function initializeChroma() {
  await embeddings.init();
  const collection = await client.createCollection({
    name: "bibot_documents",
    embeddingFunction: embeddings
  });

  vectorStore = new Chroma(client, "bibot_documents", embeddings);
  console.log("Chroma DB initialized with local embeddings");
}

async function addDocument(text, metadata) {
  if (!vectorStore) {
    await initializeChroma();
  }
  await vectorStore.addDocuments([{ pageContent: text, metadata }]);
}

async function queryDocuments(query, k = 5) {
  if (!vectorStore) {
    await initializeChroma();
  }
  return await vectorStore.similaritySearch(query, k);
}

module.exports = { initializeChroma, addDocument, queryDocuments };