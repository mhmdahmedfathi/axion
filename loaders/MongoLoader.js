const loader = require('./_common/fileLoader');
const mongoose = require('mongoose');

module.exports = class MongoLoader {
    constructor({ schemaExtension }){
        this.schemaExtension = schemaExtension
    }

    load(){
        /** load Mongo Models */
        const modules = loader(`./managers/entities/**/*.${this.schemaExtension}`);
        const models = {};

        Object.keys(modules).forEach(k => {
            const schema = modules[k];
            // Start case the model name (e.g. 'user' -> 'User')
            const modelName = k.charAt(0).toUpperCase() + k.slice(1);
            
            // Check if model already exists to avoid OverwriteModelError
            models[k] = mongoose.models[modelName] || mongoose.model(modelName, schema);
        });

        return models
    }
}