const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  insurer: { type: String, required: true, trim: true },
  premium: { type: Number, required: true, min: 0 },
  sumAssured: { type: Number, required: false, min: 0 },
  description: { type: String, required: false, trim: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Basic indexes to speed up search
PolicySchema.index({ type: 1 });
PolicySchema.index({ insurer: 1 });
PolicySchema.index({ premium: 1 });

module.exports = mongoose.model('Policy', PolicySchema);


