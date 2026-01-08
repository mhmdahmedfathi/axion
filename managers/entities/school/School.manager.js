module.exports = class School { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.httpExposed         = ['post=createSchool', 'get=getSchool', 'get=listSchools', 'put=updateSchool', 'delete=deleteSchool'];
        this.authorised          = ['createSchool', 'updateSchool', 'deleteSchool']; // Requires superadmin usually, but handled by MW
    }

    async createSchool({__longToken, name, address, phone, email, principalName, capacity}){
        const school = {name, address, phone, email, principalName, capacity};

        // Validation
        let result = await this.validators.school.createSchool(school);
        if(result) return { errors: result };

        // Creation
        let createdSchool = new this.mongomodels.school({
            ...school,
            createdBy: __longToken.userId
        });
        await createdSchool.save();

        return { school: createdSchool };
    }

    async getSchool({__longToken, id}){
        // If school admin, check if id matches their schoolId? 
        // Or we rely on __schoolAccess middleware if accessing other schools. 
        // But getSchool usually is fine to get details if you are authorized.
        
        let school = await this.mongomodels.school.findById(id);
        if(!school) return { error: 'School not found' };
        return { school };
    }

    async listSchools({__longToken}){
        // Superadmin lists all
        // School admin lists their own (handled by filter)
        
        // For now, list all. Middleware/Logic should filter if needed.
        let schools = await this.mongomodels.school.find();
        return { schools };
    }

    async updateSchool({__longToken, id, name, address, phone, email, principalName, capacity}){
        let data = {name, address, phone, email, principalName, capacity};
        // Clean undefined properties to allow partial updates
        Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

        // Validation
         let result = await this.validators.school.updateSchool(data);
         if(result) return result;

        let school = await this.mongomodels.school.findByIdAndUpdate(id, data, {new: true});
        if(!school) return { error: 'School not found' };
        return { school };
    }

    async deleteSchool({__longToken, id}){
        let school = await this.mongomodels.school.findByIdAndDelete(id);
        if(!school) return { error: 'School not found' };
        return { ok: true };
    }

}
