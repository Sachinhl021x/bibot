const { ChromaClient } = require('chromadb');

const client = new ChromaClient({ path: "http://localhost:8000" });
let collection;

async function initializeChroma() {
  try {
    console.log("Initializing Chroma...");
    collection = await client.getOrCreateCollection({
      name: "bibot_documents"
    });
    console.log("Chroma initialization complete");
  } catch (error) {
    console.error('Error initializing Chroma:', error);
    throw error;
  }
}

module.exports = { initializeChroma };