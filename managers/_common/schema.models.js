const emojis = require('../../public/emojis.data.json');

module.exports = {
    id: {
        path: "id",
        type: "string",
        length: { min: 1, max: 50 },
        regex: /^[0-9a-fA-F]{24}$/,
    },
    schoolId: {
        path: "schoolId",
        type: "string",
        length: { min: 1, max: 50 },
        label: 'School ID',
        regex: /^[0-9a-fA-F]{24}$/,
    },
    username: {
        path: 'username',
        type: 'string',
        length: {min: 3, max: 20},
        custom: 'username',
        label: 'Username',
    },
    password: {
        path: 'password',
        type: 'string',
        length: {min: 8, max: 100},
        label: 'Password',
    },
    email: {
        path: 'email',
        type: 'string',
        length: {min:3, max: 100},
        regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        label: 'Email',
    },
    role: {
        path: 'role',
        type: 'string',
        length: {min: 3, max: 50},
        label: 'Role',
    },
    title: {
        path: 'title',
        type: 'string',
        length: {min: 3, max: 300}
    },
    label: {
        path: 'label',
        type: 'string',
        length: {min: 3, max: 100}
    },
    shortDesc: {
        path: 'desc',
        type: 'string',
        length: {min:3, max: 300}
    },
    longDesc: {
        path: 'desc',
        type: 'string',
        length: {min:3, max: 2000}
    },
    url: {
        path: 'url',
        type: 'string',
        length: {min: 9, max: 300},
    },
    emoji: {
        path: 'emoji',
        type: 'Array',
        items: {
            type: 'string',
            length: {min: 1, max: 10},
            oneOf: emojis.value,
        }
    },
    price: {
        path: 'price',
        type: 'number',
    },
    avatar: {
        path: 'avatar',
        type: 'string',
        length: {min: 8, max: 100},
    },
    text: {
        type: 'String',
        length: {min: 3, max:15},
    },
    longText: {
        type: 'String',
        length: {min: 3, max:250},
    },
    paragraph: {
        type: 'String',
        length: {min: 3, max:10000},
    },
    phone: {
        type: 'String',
        length: 13,
    },

    number: {
        type: 'Number',
        length: {min: 1, max:6},
    },
    arrayOfStrings: {
        type: 'Array',
        items: {
            type: 'String',
            length: { min: 3, max: 100}
        }
    },
    obj: {
        type: 'Object',
    },
    bool: {
        type: 'Boolean',
    },
    name: {
        path: 'name',
        type: 'string',
        length: {min: 3, max: 100},
        label: 'Name',
    },
    address: {
        path: 'address',
        type: 'string',
        length: {min: 3, max: 200},
        label: 'Address',
    },
    principalName: {
        path: 'principalName',
        type: 'string',
        length: {min: 3, max: 100},
        label: 'Principal Name',
    },
    capacity: {
        path: 'capacity',
        type: 'number',
        label: 'Capacity',
    },
    grade: {
        path: 'grade',
        type: 'string',
        length: {min: 1, max: 20},
        label: 'Grade',
    },
    section: {
        path: 'section',
        type: 'string',
        length: {min: 1, max: 10},
        label: 'Section',
    },
    resources: {
        path: 'resources',
        type: 'Array',
        items: {
            type: 'string',
            length: {min: 1, max: 100},
        }
    },
    firstName: {
        path: 'firstName',
        type: 'string',
        length: {min: 1, max: 50},
        label: 'First Name',
    },
    lastName: {
        path: 'lastName',
        type: 'string',
        length: {min: 1, max: 50},
        label: 'Last Name',
    },
    dateOfBirth: {
        path: 'dateOfBirth',
        type: 'string',
        length: {min: 1, max: 50},
        label: 'Date of Birth',
    },
    enrollmentDate: {
        path: 'enrollmentDate',
        type: 'string',
        length: {min: 1, max: 50},
        label: 'Enrollment Date',
    },
    studentId: {
        path: 'studentId',
        type: 'string',
        length: {min: 1, max: 50},
        label: 'Student ID',
        regex: /^[0-9a-fA-F]{24}$/,
    },
    classroomId: {
        path: 'classroomId',
        type: 'string',
        length: {min: 1, max: 50},
        label: 'Classroom ID',
        regex: /^[0-9a-fA-F]{24}$/,
    },
    targetClassroomId: {
        path: 'targetClassroomId',
        type: 'string',
        length: {min: 1, max: 50},
        label: 'Target Classroom ID',
        regex: /^[0-9a-fA-F]{24}$/,
    },
    targetSchoolId: {
        path: 'targetSchoolId',
        type: 'string',
        length: {min: 1, max: 50},
        label: 'Target School ID',
        regex: /^[0-9a-fA-F]{24}$/,
    },
    status: {
        path: 'status',
        type: 'string',
        length: {min: 1, max: 50},
        label: 'Status',
    },
}