const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    name: { type: String, required: true },
    capacity: { type: Number },
    grade: { type: String },
    section: { type: String },
    resources: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

schema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = schema;
