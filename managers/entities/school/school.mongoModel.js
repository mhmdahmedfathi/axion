const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    principalName: { type: String },
    capacity: { type: Number },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

schema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = schema;
