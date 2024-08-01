const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3002', // This should match your React app's URL
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

//  Start the server Root route
app.get('/', (req, res) => {
  res.send('BIBot server is running');
});

// Chat route
app.post('/chat', (req, res) => {
  const { message } = req.body;
  // For now, just echo the message back
  res.json({ message: `Echo: ${message}` });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});