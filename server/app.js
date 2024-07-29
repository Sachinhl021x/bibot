const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('BIBot API is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});