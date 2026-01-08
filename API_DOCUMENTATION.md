# School Management System API Documentation

## Swagger UI

Interactive API documentation is available at:

- **URL**: `/api-docs`

## Authentication

### Register (Superadmin)

- **POST** `/api/user/createUser`
- **Body**: `{ "username": "admin", "email": "admin@school.com", "password": "pass", "role": "superadmin" }`

### Login

- **POST** `/api/auth/login`
- **Body**: `{ "email": "admin@school.com", "password": "pass" }`
- **Response**: Returns `longToken` and `shortToken`. Use `longToken` in `Authorization: Bearer <token>` header.

## Schools (Superadmin Only)

- **Header**: `Authorization: Bearer <longToken>`
- **POST** `/api/school/createSchool`
  - Body: `{ "name": "High School 1", "address": "123 St", "principalName": "Mr. Smith", "capacity": 500 }`
- **GET** `/api/school/listSchools`
- **GET** `/api/school/getSchool?id=<id>`
- **PUT** `/api/school/updateSchool?id=<id>`
  - Body: `{ "address": "New Address" }` (Partial update supported)
- **DELETE** `/api/school/deleteSchool?id=<id>`

## Classrooms (School Admin)

- **Header**: `Authorization: Bearer <longToken>`
- **POST** `/api/classroom/createClassroom`
  - Body: `{ "schoolId": "<id>", "name": "10A", "grade": "10", "section": "A", "capacity": 30, "resources": ["Projector"] }`
- **GET** `/api/classroom/listClassrooms?schoolId=<id>`
- **GET** `/api/classroom/getClassroom?id=<id>`
- **PUT** `/api/classroom/updateClassroom?id=<id>`
- **DELETE** `/api/classroom/deleteClassroom?id=<id>`

## Students

- **Header**: `Authorization: Bearer <longToken>`
- **POST** `/api/student/createStudent`
  - Body: `{ "schoolId": "<id>", "firstName": "John", "lastName": "Doe", "email": "john@doe.com", "dateOfBirth": "2010-01-01", "phone": "123456" }`
- **POST** `/api/student/enrollStudent`
  - Body: `{ "studentId": "<id>", "classroomId": "<id>" }`
- **PUT** `/api/student/transferStudent`
  - Body: `{ "studentId": "<id>", "targetClassroomId": "<id>", "targetSchoolId": "<id>" }`
- **GET** `/api/student/listStudents?schoolId=<id>&classroomId=<id>`
- **GET** `/api/student/getStudent?id=<id>`
- **PUT** `/api/student/updateStudent?id=<id>`
- **DELETE** `/api/student/deleteStudent?id=<id>`
