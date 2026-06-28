const express = require('express');
const router = express.Router();
const { getDownloads, uploadDownload, deleteDownload, getStats } = require('../controllers/downloadController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadPDF } = require('../middleware/uploadMiddleware');

router.get('/', getDownloads);
router.get('/stats', protect, adminOnly, getStats);
router.post('/upload', protect, adminOnly, uploadPDF.single('pdf'), uploadDownload);
router.delete('/:id', protect, adminOnly, deleteDownload);

module.exports = router;
