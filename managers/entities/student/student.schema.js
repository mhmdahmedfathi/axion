module.exports = {
    createStudent: [
        { model: 'schoolId', required: true },
        { model: 'firstName', required: true },
        { model: 'lastName', required: true },
        { model: 'email', required: false },
        { model: 'phone', required: false },
        { model: 'dateOfBirth', required: false },
        { model: 'enrollmentDate', required: false },
        { model: 'classroomId', required: false },
    ],
    updateStudent: [
        { model: 'firstName', required: false },
        { model: 'lastName', required: false },
        { model: 'email', required: false },
        { model: 'phone', required: false },
        { model: 'dateOfBirth', required: false },
        { model: 'status', required: false },
    ],
    enrollStudent: [
        { model: 'studentId', required: true },
        { model: 'classroomId', required: true },
    ],
    transferStudent: [
        { model: 'studentId', required: true },
        { model: 'targetClassroomId', required: false }, 
        { model: 'targetSchoolId', required: false },
    ]
}
