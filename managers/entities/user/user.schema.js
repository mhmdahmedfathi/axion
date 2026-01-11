
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
    ],
}
