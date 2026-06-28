const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    category: {
      type: String,
      enum: ['General', 'Academic', 'Exam', 'Event', 'Sports', 'Cultural', 'Other'],
      default: 'General',
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
