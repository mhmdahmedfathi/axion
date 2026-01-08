const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' }, // Nullable
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true }, // Unique per system or per school? Prompt said unique per school usually, but email is often global. Let's make it unique if present.
    phone: { type: String },
    dateOfBirth: { type: Date },
    enrollmentDate: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: ['enrolled', 'transferred', 'graduated'], 
        default: 'enrolled' 
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

schema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = schema;
