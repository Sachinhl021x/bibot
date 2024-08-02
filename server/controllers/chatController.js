const openaiService = require('../services/openaiService');
const claudeService = require('../services/claudeService');
const { queryDocuments } = require('../services/chromaService');

async function handleChatMessage(req, res) {
  const { message, model, useRag } = req.body;
  console.log(`Received chat request: model=${model}, useRag=${useRag}, message="${message}"`);

  try {
    let prompt = message;
    let context = null;

    if (useRag) {
      console.log("RAG enabled, querying documents...");
      const relevantDocs = await queryDocuments(message);
      console.log(`Retrieved ${relevantDocs.length} relevant documents`);
      context = relevantDocs.map(doc => doc.pageContent).join('\n\n');
      prompt = `Context: ${context}\n\nHuman: ${message}\n\nAssistant:`;
    }

    console.log(`Generating response using ${model}...`);
    let response;
    if (model === 'gpt-3.5-turbo') {
      response = await openaiService.generateResponse(prompt);
    } else if (model === 'claude-v1') {
      response = await claudeService.generateResponse(prompt);
    } else {
      throw new Error('Invalid model selected');
    }
    console.log("Response generated successfully");

    const responseObject = { 
      response, 
      context: useRag ? context : null 
    };
    console.log("Sending response to client:", responseObject);
    res.json(responseObject);
  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}

module.exports = { handleChatMessage };