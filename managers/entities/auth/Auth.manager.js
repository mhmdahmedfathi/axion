const bcrypt = require('bcrypt');

module.exports = class Auth { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.httpExposed         = ['login'];
    }

    async login({email, password}){
        // Validation
        const data = {email, password};
        let result = await this.validators.auth.login(data);
        if(result) return { errors: result };

        // Find user
        let user = await this.mongomodels.user.findOne({email});
        if(!user){
            return { error: 'Invalid Credentials' };
        }

        // Check password
        let match = await bcrypt.compare(password, user.password);
        if(!match){
            return { error: 'Invalid Credentials' };
        }

        // Generate Tokens
        let longToken = this.tokenManager.genLongToken({
            userId: user._id, 
            userKey: user.username
        });
        
        let shortToken = this.tokenManager.genShortToken({
            userId: user._id, 
            userKey: user.username,
            sessionId: 'session-'+Date.now(), // simple session id
            deviceId: 'device-'+Date.now(),   // simple device id
        });

        return {
            user,
            longToken,
            shortToken
        };
    }

}
