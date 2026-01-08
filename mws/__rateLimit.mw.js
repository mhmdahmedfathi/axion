module.exports = ({ meta, config, managers, cache }) =>{
    return async ({req, res, next})=>{
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const key = `rate_limit:${ip}`;
        const limit = 100; // requests
        const window = 60; // seconds

        try {
            // Simple fixed window counter using Redis
            let current = await cache.key.get({ key });
            
            if(!current){
                await cache.key.set({ key, data: 1, ttl: window });
                return next();
            }

            if(parseInt(current) >= limit){
                return managers.responseDispatcher.dispatch(res, {ok: false, code:429, errors: 'too many requests'});
            }

            // Increment
             await cache.key.incr({ key });
             next();

        } catch(err){
            console.error('Rate limit error', err);
            // Fail open if redis down? Or fail closed? Fail open for now.
            next();
        }
    }
}
