module.exports = class Classroom { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.httpExposed         = ['post=createClassroom', 'get=getClassroom', 'get=listClassrooms', 'put=updateClassroom', 'delete=deleteClassroom', 'get=getBySchool'];
    }

    async createClassroom({__longToken, schoolId, name, capacity, grade, section, resources}){
        const classroom = {schoolId, name, capacity, grade, section, resources};

        // Validation
        let result = await this.validators.classroom.createClassroom(classroom);
        if(result) return { errors: result };

        // Check if school exists
        let school = null;
        try {
            school = await this.mongomodels.school.findById(schoolId);
        } catch (error) {
            // Invalid ID format will result in school being null
        }
        if(!school) return { error: 'School not found', code: 404 };

        // Creation
        let createdClassroom = new this.mongomodels.classroom({
            ...classroom,
            createdBy: __longToken.userId
        });
        await createdClassroom.save();

        return { classroom: createdClassroom };
    }

    async getClassroom({__longToken, id}){
        let classroom = await this.mongomodels.classroom.findById(id).populate('schoolId');
        if(!classroom) return { error: 'Classroom not found' };
        return { classroom };
    }

    async listClassrooms({__longToken, schoolId}){
        let query = {};
        if(schoolId) query.schoolId = schoolId;
        
        let classrooms = await this.mongomodels.classroom.find(query);
        return { classrooms };
    }

    async updateClassroom({__longToken, id, name, capacity, grade, section, resources}){
        let data = {name, capacity, grade, section, resources};
        // Clean undefined properties to allow partial updates
        Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

         let result = await this.validators.classroom.updateClassroom(data);
         if(result) return { errors: result };

        let classroom = await this.mongomodels.classroom.findByIdAndUpdate(id, data, {new: true});
        if(!classroom) return { error: 'Classroom not found' };
        return { classroom };
    }

    async deleteClassroom({__longToken, id}){
        let classroom = await this.mongomodels.classroom.findByIdAndDelete(id);
        if(!classroom) return { error: 'Classroom not found' };
        return { ok: true };
    }

    async getBySchool({__longToken, schoolId}){
        return this.listClassrooms({__longToken, schoolId});
    }

}
