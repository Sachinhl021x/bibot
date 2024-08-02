const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { addDocument } = require('../services/chromaService');
const router = express.Router();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Initialize S3
const s3 = new AWS.S3();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `uploads/${Date.now()}-${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
  };

  try {
    const data = await s3.upload(params).promise();
    
    // Process and embed the document
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await textSplitter.splitText(req.file.buffer.toString());
    
    for (const chunk of chunks) {
      await addDocument(chunk, { source: req.file.originalname });
    }

    res.json({ fileUrl: data.Location, message: 'File uploaded and processed successfully' });
  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).send('Error processing file');
  }
});

module.exports = router;