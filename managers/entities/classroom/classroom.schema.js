module.exports = {
    createClassroom: [
        { model: 'schoolId', required: true },
        { model: 'name', required: true },
        { model: 'capacity', required: false },
        { model: 'grade', required: false },
        { model: 'section', required: false },
        { model: 'resources', required: false },
    ],
    updateClassroom: [
        { model: 'name', required: false },
        { model: 'capacity', required: false },
        { model: 'grade', required: false },
        { model: 'section', required: false },
        { model: 'resources', required: false },
    ],
}
