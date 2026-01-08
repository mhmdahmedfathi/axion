const http              = require('http');
const express           = require('express');
const cors              = require('cors');
const app               = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

module.exports = class UserServer {
    constructor({config, managers}){
        this.config        = config;
        this.userApi       = managers.userApi;
        this.managers      = managers;
    }

    get app() { return app; }
    
    /** for injecting middlewares */
    use(args){
        app.use(args);
    }

    /** server configs */
    run(){
        this.setup();

        let server = http.createServer(app);
        server.listen(this.config.dotEnv.USER_PORT, () => {
            console.log(`${(this.config.dotEnv.SERVICE_NAME).toUpperCase()} is running on port: ${this.config.dotEnv.USER_PORT}`);
        });
    }

    setup(){
        app.use(cors({origin: '*'}));
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true}));
        app.use('/static', express.static('public'));

        /** an error handler */
        app.use((err, req, res, next) => {
            if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
                if(!req.headers.authorization){
                    return res.status(401).send({ ok: false, data: {}, errors: ['Unauthorized'], message: 'Unauthorized' });
                }
                const token = req.headers.authorization.split(' ')[1];
                // Verify token if present
                let decodedShort = this.managers.token.verifyShortToken({token});
                let decodedLong = this.managers.token.verifyLongToken({token});
                if(!decodedShort && !decodedLong){
                    return res.status(401).send({ ok: false, data: {}, errors: ['Unauthorized'], message: 'Unauthorized' });
                }

                return res.status(400).send({ ok: false, data: {}, errors: [], message: 'Invalid JSON format' });
            }
            console.error(err.stack)
            res.status(500).send('Something broke!')
        });
        
        /** a single middleware to handle all */
        app.all('/api/:moduleName/:fnName', this.userApi.mw);
    }
}