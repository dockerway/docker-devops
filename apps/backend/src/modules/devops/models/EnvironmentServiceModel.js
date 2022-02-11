const mongoose = require('mongoose'); 



const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const EnvironmentServiceSchema = new Schema({ 

 environment: {type: mongoose.Schema.Types.ObjectId, ref: "Environment", required: true, unique: false, index: false},
 service: {type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true, unique: false, index: false},
 stack: {type: String, required: true, unique: false, index: false}


}, { timestamps: true });




EnvironmentServiceSchema.plugin(mongoosePaginate);
EnvironmentServiceSchema.plugin(uniqueValidator, {message: 'validation.unique'});

const EnvironmentService = mongoose.model('EnvironmentService', EnvironmentServiceSchema);

module.exports = EnvironmentService;