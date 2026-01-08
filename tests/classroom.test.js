const request = require('supertest');
const managers = require('./test.index');

let app;
let token;
let schoolId;
let createdClassroomId;

beforeAll(async () => {
    app = managers.userServer.app;
    token = managers.token.genLongToken({userId: '507f1f77bcf86cd799439011', userKey: 'testKey'});

    // Create a school for testing classrooms
    const res = await request(app)
        .post('/api/school/createSchool')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Classroom Test School',
            address: '123 Test St',
            principalName: 'Principal',
            capacity: 1000
        });
    schoolId = res.body.data.school._id;
});

describe('Classroom API', () => {
    
    it('should create a classroom', async () => {
        const res = await request(app)
            .post('/api/classroom/createClassroom')
            .set('Authorization', `Bearer ${token}`)
            .send({
                schoolId: schoolId,
                name: '10A',
                grade: '10',
                section: 'A',
                capacity: 30
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.ok).toBe(true);
        expect(res.body.data.classroom._id).toBeDefined();
        createdClassroomId = res.body.data.classroom._id;
    });

    it('should fail to create classroom with invalid schoolId', async () => {
        const res = await request(app)
            .post('/api/classroom/createClassroom')
            .set('Authorization', `Bearer ${token}`)
            .send({
                schoolId: '695f7ea5a0bf2c233db120e7', // Random valid but non-existent ID
                name: '10B'
            });
        
        // Expect 404 as implemented
        expect(res.statusCode).toEqual(404);
        expect(res.body.ok).toBe(false);
        expect(res.body.message).toBe('School not found');
    });

    it('should list classrooms for a school', async () => {
        const res = await request(app)
            .get(`/api/classroom/listClassrooms?schoolId=${schoolId}`)
            .set('Authorization', `Bearer ${token}`);
            
        expect(res.statusCode).toEqual(200);
        expect(res.body.ok).toBe(true);
        expect(Array.isArray(res.body.data.classrooms)).toBe(true);
        expect(res.body.data.classrooms.length).toBeGreaterThan(0);
    });

    it('should update a classroom', async () => {
        const res = await request(app)
            .put(`/api/classroom/updateClassroom?id=${createdClassroomId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                capacity: 35
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.ok).toBe(true);
        expect(res.body.data.classroom.capacity).toEqual(35);
    });

    it('should delete a classroom', async () => {
        const res = await request(app)
            .delete(`/api/classroom/deleteClassroom?id=${createdClassroomId}`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.ok).toBe(true);
    });

});
