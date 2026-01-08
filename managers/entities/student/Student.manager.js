module.exports = class Student { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.httpExposed         = [
            'post=createStudent', 'get=getStudent', 'get=listStudents', 'put=updateStudent', 'delete=deleteStudent', 
            'post=enrollStudent', 'put=transferStudent', 'get=getByClassroom', 'get=getBySchool'
        ];
    }

    async createStudent({__longToken, schoolId, firstName, lastName, email, phone, dateOfBirth, enrollmentDate, classroomId}){
        const student = {schoolId, firstName, lastName, email, phone, dateOfBirth, enrollmentDate, classroomId};

        // Validation
        let result = await this.validators.student.createStudent(student);
        if(result) return { errors: result };

        // Check if school exists
        let school = null;
        try {
            school = await this.mongomodels.school.findById(schoolId);
        } catch (error) {}
        if(!school) return { error: 'School not found', code: 404 };

        // Check if classroom exists (if provided)
        if(classroomId){
            let classroom = null;
             try {
                classroom = await this.mongomodels.classroom.findById(classroomId);
            } catch (error) {}
            if(!classroom) return { error: 'Classroom not found', code: 404 };
        }

        // Creation
        let createdStudent = new this.mongomodels.student({
            ...student,
            createdBy: __longToken.userId
        });
        
        try {
            await createdStudent.save();
        } catch(err) {
            console.error(err);
            if(err.code === 11000) return { error: 'Email already exists' };
            return { error: 'Failed to create student' };
        }

        return { student: createdStudent };
    }

    async getStudent({__longToken, id}){
        let student = await this.mongomodels.student.findById(id)
            .populate('schoolId')
            .populate('classroomId');
        if(!student) return { error: 'Student not found' };
        return { student };
    }

    async listStudents({__longToken, schoolId, classroomId}){
        let query = {};
        if(schoolId) query.schoolId = schoolId;
        if(classroomId) query.classroomId = classroomId;
        
        let students = await this.mongomodels.student.find(query);
        return { students };
    }

    async updateStudent({__longToken, id, firstName, lastName, email, phone, dateOfBirth, status}){
        let data = {firstName, lastName, email, phone, dateOfBirth, status};
        // Clean undefined properties to allow partial updates
        Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

         let result = await this.validators.student.updateStudent(data);
         if(result) return { errors: result };

        let student = await this.mongomodels.student.findByIdAndUpdate(id, data, {new: true});
        if(!student) return { error: 'Student not found', code: 404 };
        return { student };
    }

    async deleteStudent({__longToken, id}){
        let student = await this.mongomodels.student.findByIdAndDelete(id);
        if(!student) return { error: 'Student not found' };
        return { ok: true };
    }

    async enrollStudent({__longToken, studentId, classroomId}){
        let student = await this.mongomodels.student.findById(studentId);
        if(!student) return { error: 'Student not found', code: 404 };

        // Check if classroom exists
        let classroom = null;
        try {
            classroom = await this.mongomodels.classroom.findById(classroomId);
        } catch (error) {}
        if(!classroom) return { error: 'Classroom not found', code: 404 };

        student.classroomId = classroomId;
        student.status = 'enrolled';
        await student.save();

        return { student };
    }

    async transferStudent({__longToken, studentId, targetClassroomId, targetSchoolId}){
        let student = await this.mongomodels.student.findById(studentId);
        if(!student) return { error: 'Student not found', code: 404 };

        if(targetSchoolId) {
            let school = null;
            try {
                school = await this.mongomodels.school.findById(targetSchoolId);
            } catch (error) {}
            if(!school) return { error: 'Target School not found', code: 404 };
            student.schoolId = targetSchoolId;
        }
        
        if(targetClassroomId) {
            let classroom = null;
            try {
                classroom = await this.mongomodels.classroom.findById(targetClassroomId);
            } catch (error) {}
            if(!classroom) return { error: 'Target Classroom not found', code: 404 };
            student.classroomId = targetClassroomId;
        } else if (targetSchoolId && !targetClassroomId) {
             student.classroomId = null; // Unassigned if moving to new school without class
        }

        student.status = 'transferred';
        
        await student.save();
        return { student };
    }

    async getByClassroom({__longToken, classroomId}){
        return this.listStudents({__longToken, classroomId});
    }

    async getBySchool({__longToken, schoolId}){
        return this.listStudents({__longToken, schoolId});
    }

}
