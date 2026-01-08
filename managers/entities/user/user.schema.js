
module.exports = {
    createUser: [
        {
            model: 'username',
            required: true,
        },
        {
            model: 'email',
            required: true,
        },
        {
            model: 'password',
            required: true,
        },
        {
            model: 'role',
            required: false, // Optional, defaults to school_admin in mongoose model
        },
        {
            model: 'schoolId',
            required: false, // Required if role is school_admin, but validation can be handled in manager or improved here
        }
    ],
}
