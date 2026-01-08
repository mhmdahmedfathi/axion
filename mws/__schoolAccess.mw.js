module.exports = ({ meta, config, managers }) =>{
    return ({req, res, next})=>{
        const user = req.user; // Assumes __role middleware has attached user
        if(!user){
             return managers.responseDispatcher.dispatch(res, {ok: false, code:401, errors: 'unauthorized'});
        }

        // Superadmin has access to everything
        if(user.role === 'superadmin'){
            return next();
        }

        // School Admin must have schoolId matching the request
        // We assume schoolId is passed in body, params or query. 
        // Or we are accessing a resource that has a schoolId.
        
        let targetSchoolId = req.params.schoolId || req.body.schoolId || req.query.schoolId;
        
        // If we are operating on a resource that 'belongs' to a school, we need to ensure the user is from that school.
        // For example, creating a classroom requires schoolId. 
        
        if(!targetSchoolId && req.params.id){
            // If we are accessing an entity by ID, we might need to fetch it to check schoolId.
            // This is complex for a generic middleware. 
            // For now, let's enforce that if schoolId is present in request, it must match user's schoolId.
        }

        if(targetSchoolId){
            if(user.schoolId.toString() !== targetSchoolId.toString()){
                return managers.responseDispatcher.dispatch(res, {ok: false, code:403, errors: 'forbidden: school mismatch'});
            }
        }
        
        // Also enforce that any data creation/update uses the user's schoolId
        if(req.method === 'POST' || req.method === 'PUT'){
             req.body.schoolId = user.schoolId; // Force the schoolId
        }

        next();
    }
}
