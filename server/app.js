require('web-streams-polyfill/polyfill');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { initializeChroma } = require('./services/chromaService');
const chatController = require('./controllers/chatController');
const uploadRoutes = require('./routes/uploadRoutes');
const brdRoutes = require('./routes/brdRoutes');

dotenv.config();

const app = express();

// Basic CORS configuration
app.use(cors());

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('BIBot server is running');
});

app.post('/api/chat', chatController.handleChatMessage);
app.use('/api', uploadRoutes);
app.use('/api/brd', brdRoutes);

const port = process.env.PORT || 3000;

console.log('Starting server initialization...');

// Simple initialization without complex error handling
initializeChroma()
  .then(() => {
    console.log('Chroma initialized successfully');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize Chroma:', error);
    process.exit(1);
  });

console.log('Server setup complete');