const { ChromaClient } = require('chromadb');

class LocalEmbeddings {
  constructor() {
    this.model = null;
    this.pipeline = null;
  }

  async init() {
    try {
      const transformers = await import('@xenova/transformers');
      this.pipeline = transformers.pipeline;
      this.model = await this.pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    } catch (error) {
      console.error('Error initializing embedding model:', error);
      throw error;
    }
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

const client = new ChromaClient({ path: "http://localhost:8000" });
const embeddings = new LocalEmbeddings();

let collection;

async function initializeChroma() {
  try {
    console.log("Initializing Chroma...");
    await embeddings.init();
    console.log("Embeddings initialized, creating or getting collection...");
    collection = await client.getOrCreateCollection({
      name: "bibot_documents",
      embeddingFunction: embeddings
    });
    console.log("Collection ready");
  } catch (error) {
    console.error('Error initializing Chroma:', error);
    throw error;
  }
}

async function addDocument(text, metadata) {
  try {
    if (!collection) {
      console.log("Collection not initialized, initializing Chroma...");
      await initializeChroma();
    }
    console.log("Adding document to Chroma...");
    const id = Date.now().toString(); // Generate a unique ID
    const embedding = await embeddings.embedQuery(text);
    await collection.add({
      ids: [id],
      documents: [text],
      metadatas: [metadata],
      embeddings: [embedding]
    });
    console.log("Document added successfully");
  } catch (error) {
    console.error('Error adding document to Chroma:', error);
    throw error;
  }
}

async function queryDocuments(query, k = 5) {
  try {
    if (!collection) {
      console.log("Collection not initialized, initializing Chroma...");
      await initializeChroma();
    }
    console.log("Querying documents from Chroma...");
    const queryEmbedding = await embeddings.embedQuery(query);
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: k
    });
    console.log("Query successful");
    return results.documents[0].map((doc, i) => ({
      pageContent: doc,
      metadata: results.metadatas[0][i]
    }));
  } catch (error) {
    console.error('Error querying documents from Chroma:', error);
    throw error;
  }
}

module.exports = { initializeChroma, addDocument, queryDocuments };