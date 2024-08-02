const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { initializeChroma } = require('./services/chromaService');
const chatController = require('./controllers/chatController');
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3002',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('BIBot server is running');
});

app.post('/api/chat', chatController.handleChatMessage);
app.use('/api', uploadRoutes);

// Initialize Chroma before starting the server
initializeChroma()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize Chroma:', error);
    process.exit(1);
  });