const mongoose = require('mongoose');



const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const EnvironmentSchema = new Schema({

 name: {type: String, required: true, unique: true, index: true},
 permission: [{type: String, enum: ['ENV_DEV_VIEW','ENV_DEV_EDIT','ENV_QA_VIEW','ENV_QA_EDIT','ENV_PROD_VIEW','ENV_PROD_EDIT'], required: false, index: false}],
 dockerApiUrl: {type: String, required: false, unique: false, index: false},
 dockerApiToken: {type: String, required: false, unique: false, index: false}


}, { timestamps: true });




EnvironmentSchema.plugin(mongoosePaginate);
EnvironmentSchema.plugin(uniqueValidator, {message: 'validation.unique'});

const Environment = mongoose.model('Environment', EnvironmentSchema);

module.exports = Environment;
