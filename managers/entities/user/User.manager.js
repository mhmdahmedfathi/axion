const bcrypt = require('bcrypt');

module.exports = class User { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.usersCollection     = "users";
        this.httpExposed         = ['createUser'];
    }

    async _hashPassword(password){
        return await bcrypt.hash(password, 10);
    }

    async createUser({username, email, password, role, schoolId}){
        const user = {username, email, password, role, schoolId};

        // Data validation
        let result = await this.validators.user.createUser(user);
        if(result) return result;
        
        // Check if user exists
        const existingUser = await this.mongomodels.user.findOne({ $or: [{email}, {username}] });
        if(existingUser) {
            return { error: 'User already exists' };
        }

        // Hash password
        const hashedPassword = await this._hashPassword(password);

        // Creation Logic
        let createdUser = new this.mongomodels.user({
            username, 
            email, 
            password: hashedPassword,
            role,
            schoolId
        });

        await createdUser.save();
        
        // Generate Token
        let longToken = this.tokenManager.genLongToken({
            userId: createdUser._id, 
            userKey: createdUser.username // using username as key for now
        });
        
        // Response
        return {
            user: createdUser, 
            longToken 
        };
    }

}
