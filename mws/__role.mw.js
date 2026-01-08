module.exports = ({ meta, config, managers }) =>{
    return ({req, res, next})=>{
        const userRole = req.decoded.role; // Assuming role is in the decoded token or we fetch it
        // Ideally, we might need to fetch the user from DB to get the latest role, 
        // or ensure it's in the token. For now, let's assume we need to fetch it or it's in the token.
        // Token.manager.js usually puts userId, userKey in the token. 
        // We might want to add role to the token or fetch it here.
        // For efficiency, let's check if role is in token, if not fetch from DB (caching recommended).
        
        // Actually, the previous steps didn't add role to the token. 
        // Let's assume we will fetch user using userId from token.
        
        const userId = req.decoded.userId;
        
        managers.mongomodels.user.findById(userId)
            .then(user => {
                if(!user){
                    return managers.responseDispatcher.dispatch(res, {ok: false, code:401, errors: 'unauthorized'});
                }
                
                const requiredRoles = meta.roles || [];
                if(requiredRoles.length > 0 && !requiredRoles.includes(user.role)){
                    return managers.responseDispatcher.dispatch(res, {ok: false, code:403, errors: 'forbidden'});
                }
                
                req.user = user; // attach user to request
                next();
            })
            .catch(err => {
                console.error(err);
                return managers.responseDispatcher.dispatch(res, {ok: false, code:500, errors: 'internal server error'});
            });
    }
}
