const express = require('express');
const multer = require('multer');
const brdController = require('../controllers/brdController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), brdController.uploadBRD);
router.get('/list', brdController.listBRDs);
router.post('/generate', brdController.generateCode);
router.post('/execute', brdController.executeCode);

module.exports = router;