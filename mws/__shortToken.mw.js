module.exports = ({ meta, config, managers }) =>{
    return ({req, res, next})=>{
        if(!req.headers.authorization){
            console.log('token required but not found')
            return managers.responseDispatcher.dispatch(res, {ok: false, code:401, errors: ['Unauthorized']});
        }
        let token = req.headers.authorization.split(' ')[1];
        let decoded = null;
        try {
            decoded = managers.token.verifyShortToken({token});
            if(!decoded){
                console.log('failed to decode-1')
                return managers.responseDispatcher.dispatch(res, {ok: false, code:401, errors: ['Unauthorized']});
            };
        } catch(err){
            console.log('failed to decode-2')
            return managers.responseDispatcher.dispatch(res, {ok: false, code:401, errors: ['Unauthorized']});
        }
        next(decoded);
    }
}