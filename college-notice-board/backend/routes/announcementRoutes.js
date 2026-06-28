const express = require('express');
const router = express.Router();
const {
  getAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement, deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadImage } = require('../middleware/uploadMiddleware');

router.get('/', getAnnouncements);
router.get('/:id', getAnnouncement);
router.post('/', protect, adminOnly, uploadImage.single('image'), createAnnouncement);
router.put('/:id', protect, adminOnly, uploadImage.single('image'), updateAnnouncement);
router.delete('/:id', protect, adminOnly, deleteAnnouncement);

module.exports = router;
