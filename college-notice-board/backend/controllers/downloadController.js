const path = require('path');
const fs = require('fs');
const Download = require('../models/Download');

const getDownloads = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (category && category !== 'All') query.category = category;
    const total = await Download.countDocuments(query);
    const downloads = await Download.find(query)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ downloads, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadDownload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { title, category } = req.body;
    const download = await Download.create({
      title,
      category,
      pdfUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
    });
    res.status(201).json(download);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteDownload = async (req, res) => {
  try {
    const download = await Download.findById(req.params.id);
    if (!download) return res.status(404).json({ message: 'File not found' });
    const filePath = path.join(__dirname, '..', download.pdfUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await download.deleteOne();
    res.json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStats = async (req, res) => {
  try {
    const Announcement = require('../models/Announcement');
    const Notice = require('../models/Notice');
    const User = require('../models/User');
    const [announcements, notices, downloads, users] = await Promise.all([
      Announcement.countDocuments(),
      Notice.countDocuments(),
      Download.countDocuments(),
      User.countDocuments(),
    ]);
    res.json({ announcements, notices, downloads, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDownloads, uploadDownload, deleteDownload, getStats };
