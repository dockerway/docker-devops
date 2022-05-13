const mongoose = require('mongoose');



const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const EnvironmentSchema = new Schema({

 name: {type: String, required: true, unique: true, index: true},
 dockerApiUrl: {type: String, required: false, unique: false, index: false},
 dockerApiToken: {type: String, required: false, unique: false, index: false},
 type: {type: String, enum: ['DEV', 'QA', 'PRE', 'PROD'], required: true, unique: false, index: false}


}, { timestamps: true });




EnvironmentSchema.plugin(mongoosePaginate);
EnvironmentSchema.plugin(uniqueValidator, {message: 'validation.unique'});

const Environment = mongoose.model('Environment', EnvironmentSchema);

module.exports = Environment;
