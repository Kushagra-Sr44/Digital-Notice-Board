const Notice = require('../models/Notice');

const getNotices = async (req, res) => {
  try {
    const { search, department, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
    if (department && department !== 'All') query.department = department;
    const total = await Notice.countDocuments(query);
    const notices = await Notice.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ notices, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createNotice = async (req, res) => {
  try {
    const { title, description, department, priority } = req.body;
    const notice = await Notice.create({ title, description, department, priority, createdBy: req.user._id });
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateNotice = async (req, res) => {
  try {
    const { title, description, department, priority } = req.body;
    const notice = await Notice.findByIdAndUpdate(
      req.params.id, { title, description, department, priority }, { new: true }
    );
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json({ message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getNotices, createNotice, updateNotice, deleteNotice };
