const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function generateResponse(prompt) {
  try {
    const response = await anthropic.completions.create({
      model: 'claude-2.1',
      max_tokens_to_sample: 150,
      prompt: `Human: ${prompt}\n\nAssistant:`,
    });

    return response.completion;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

module.exports = { generateResponse };