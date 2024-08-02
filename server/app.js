const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
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

// Root route
app.get('/', (req, res) => {
  res.send('BIBot server is running');
});

// Chat route
app.post('/api/chat', chatController.handleChatMessage);

// File upload routes
app.use('/api', uploadRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
