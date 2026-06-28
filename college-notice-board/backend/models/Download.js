const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    pdfUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    category: {
      type: String,
      enum: ['Syllabus', 'Timetable', 'Circular', 'Form', 'Result', 'Other'],
      default: 'Other',
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Download', downloadSchema);
