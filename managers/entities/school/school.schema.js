module.exports = {
    createSchool: [
        { model: 'name', required: true },
        { model: 'address', required: false },
        { model: 'phone', required: false },
        { model: 'email', required: false },
        { model: 'principalName', required: false },
        { model: 'capacity', required: false },
    ],
    updateSchool: [
        { model: 'name', required: false },
        { model: 'address', required: false },
        { model: 'phone', required: false },
        { model: 'email', required: false },
        { model: 'principalName', required: false },
        { model: 'capacity', required: false },
    ],
    getSchool: [
        { model: 'id', required: true },
    ],
    deleteSchool: [
        { model: 'id', required: true },
    ],
}
