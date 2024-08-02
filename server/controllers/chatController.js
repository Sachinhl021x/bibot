const openaiService = require('../services/openaiService');
const claudeService = require('../services/claudeService');
const { queryDocuments } = require('../services/chromaService');

async function handleChatMessage(req, res) {
  const { message, model, useRag } = req.body;

  try {
    let prompt = message;
    let context = null;

    if (useRag) {
      // Retrieve relevant documents
      const relevantDocs = await queryDocuments(message);
      context = relevantDocs.map(doc => doc.pageContent).join('\n\n');

      // Construct the prompt with context
      prompt = `Context: ${context}\n\nHuman: ${message}\n\nAssistant:`;
    }

    let response;
    if (model === 'gpt-3.5-turbo') {
      response = await openaiService.generateResponse(prompt);
    } else if (model === 'claude-v1') {
      response = await claudeService.generateResponse(prompt);
    } else {
      throw new Error('Invalid model selected');
    }

    res.json({ response, context: useRag ? context : null });
  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}

module.exports = { handleChatMessage };