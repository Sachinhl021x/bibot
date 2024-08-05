const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { OpenAI } = require('@langchain/openai');
const { exec } = require('child_process');
const fs = require('fs');

const s3 = new AWS.S3();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.uploadBRD = async (req, res) => {
  try {
    console.log("Uploading BRD file...");
    const file = req.file;
    if (!file) {
      throw new Error("No file provided");
    }
    const key = `brds/${uuidv4()}-${file.originalname}`;
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer
    };
    await s3.upload(params).promise();
    console.log("File uploaded successfully. Key:", key);
    res.json({ key, message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: `Error uploading file: ${error.message}` });
  }
};

exports.listBRDs = async (req, res) => {
    try {
      console.log("Listing BRDs...");
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Prefix: 'brds/'
      };
      const data = await s3.listObjectsV2(params).promise();
      const brds = data.Contents.map(item => ({
        key: item.Key,
        name: item.Key.split('/').pop(),
        lastModified: item.LastModified
      }));
      console.log(`Found ${brds.length} BRDs`);
      res.json(brds);
    } catch (error) {
      console.error('Error listing BRDs:', error);
      res.status(500).json({ message: `Error listing BRDs: ${error.message}` });
    }
  };

// In brdController.js

exports.generateCode = async (req, res) => {
    try {
      console.log("Generating code...");
      const { brdKey, additionalInstructions } = req.body;
      console.log("Received request with brdKey:", brdKey, "and instructions:", additionalInstructions);
  
      if (!brdKey) {
        throw new Error("No BRD key provided");
      }
  
      // Fetch BRD content from S3
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: brdKey
      };
      console.log("Fetching BRD from S3...");
      const data = await s3.getObject(params).promise();
      const brdContent = data.Body.toString('utf-8');
      console.log("BRD content fetched, length:", brdContent.length);
  
      // Generate Python code
      console.log("Generating Python code...");
      const pythonResponse = await openai.call(`Generate Python code for: ${brdContent}\n${additionalInstructions}`);
      console.log("Python code generated, length:", pythonResponse.length);
  
      // Generate SQL code
      console.log("Generating SQL code...");
      const sqlResponse = await openai.call(`Generate SQL code for: ${brdContent}\n${additionalInstructions}`);
      console.log("SQL code generated, length:", sqlResponse.length);
  
      const code = `Python Code:\n\n${pythonResponse}\n\nSQL Code:\n\n${sqlResponse}`;
      console.log("Sending response...");
      res.json({ code, output: 'Code generated successfully' });
    } catch (error) {
      console.error('Error generating code:', error);
      res.status(500).json({ message: `Error generating code: ${error.message}` });
    }
  };

exports.executeCode = async (req, res) => {
  try {
    console.log("Executing code...");
    const { code, output } = req.body;
    if (!code) {
      throw new Error("No code provided");
    }

    // Extract Python code
    const pythonCode = code.split('SQL Code:')[0].replace('Python Code:', '').trim();
    console.log("Extracted Python code:", pythonCode);

    // Save Python code to a temporary file
    const tempFile = `/tmp/temp_${Date.now()}.py`;
    fs.writeFileSync(tempFile, pythonCode);
    console.log("Python code saved to temporary file:", tempFile);

    // Execute Python code
    exec(`python ${tempFile}`, (error, stdout, stderr) => {
      // Delete the temporary file
      fs.unlinkSync(tempFile);
      console.log("Temporary file deleted");

      if (error) {
        console.error(`Error executing Python code: ${error}`);
        return res.status(500).json({ message: 'Error executing Python code', error: stderr });
      }

      console.log("Python code executed successfully");
      const newOutput = `Previous output:\n${output}\n\nPython execution result:\n${stdout}`;
      res.json({ output: newOutput });
    });
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({ message: `Error executing code: ${error.message}` });
  }
};