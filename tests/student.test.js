const request = require('supertest');
const managers = require('./test.index');

let app;
let token;
let schoolId;
let classroomId;
let createdStudentId;

beforeAll(async () => {
    app = managers.userServer.app;
    token = managers.token.genLongToken({userId: '507f1f77bcf86cd799439011', userKey: 'testKey'});

    // Create School
    const schoolRes = await request(app)
        .post('/api/school/createSchool')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Student Test School',
            address: '123 Test St',
            principalName: 'Principal',
            capacity: 1000
        });
    schoolId = schoolRes.body.data.school._id;

    // Create Classroom
    const classRes = await request(app)
        .post('/api/classroom/createClassroom')
        .set('Authorization', `Bearer ${token}`)
        .send({
            schoolId: schoolId,
            name: '10A',
            grade: '10',
            section: 'A',
            capacity: 30
        });
    classroomId = classRes.body.data.classroom._id;
});

describe('Student API', () => {
    
    it('should create a student', async () => {
        const res = await request(app)
            .post('/api/student/createStudent')
            .set('Authorization', `Bearer ${token}`)
            .send({
                schoolId: schoolId,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                dateOfBirth: '2010-01-01'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.ok).toBe(true);
        expect(res.body.data.student._id).toBeDefined();
        createdStudentId = res.body.data.student._id;
    });

    it('should fail to create student with invalid schoolId', async () => {
        const res = await request(app)
            .post('/api/student/createStudent')
            .set('Authorization', `Bearer ${token}`)
            .send({
                schoolId: '695f7ea5a0bf2c233db120e7', 
                firstName: 'Jane',
                lastName: 'Doe'
            });
        
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('School not found');
    });

    it('should enroll a student', async () => {
        const res = await request(app)
            .post('/api/student/enrollStudent')
            .set('Authorization', `Bearer ${token}`)
            .send({
                studentId: createdStudentId,
                classroomId: classroomId
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.ok).toBe(true);
        expect(res.body.data.student.classroomId).toEqual(classroomId);
        expect(res.body.data.student.status).toEqual('enrolled');
    });

    it('should fail to enroll with invalid classroomId', async () => {
        const res = await request(app)
            .post('/api/student/enrollStudent')
            .set('Authorization', `Bearer ${token}`)
            .send({
                studentId: createdStudentId,
                classroomId: '695f7ea5a0bf2c233db120e7'
            });
        
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Classroom not found');
    });

    it('should update a student', async () => {
        const res = await request(app)
            .put(`/api/student/updateStudent?id=${createdStudentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                firstName: 'Johnny'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.student.firstName).toEqual('Johnny');
    });

    it('should delete a student', async () => {
        const res = await request(app)
            .delete(`/api/student/deleteStudent?id=${createdStudentId}`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.ok).toBe(true);
    });

});
