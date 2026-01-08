const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['superadmin', 'school_admin'], 
        default: 'school_admin' 
    },
    schoolId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'School',
        required: function() { return this.role === 'school_admin'; }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

schema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = schema;
