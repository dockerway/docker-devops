const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const EnvSchema = new Schema({
 name: {type: String, required: true, index: false},
 defaultValue: {type: String, required: false, index: false},
})

const ServiceSchema = new Schema({

 name: {type: String, required: true, unique: false, index: false},
 description: {type: String, required: false, unique: false, index: false},
 platform: {type: mongoose.Schema.Types.ObjectId, ref: "Platform", required: true, unique: false, index: false},

 image: {type: String, required: false, unique: false, index: false},
 repository: {type: String, required: false, unique: false, index: false},

 volumes: [{type: String, required: false}],
 ports: [{type: String, required: false}],
 envs: [EnvSchema]

}, { timestamps: true });


ServiceSchema.index({ name: 1, platform: 1}, { unique: true });

ServiceSchema.plugin(mongoosePaginate);
ServiceSchema.plugin(uniqueValidator, {message: 'validation.unique'});

const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;
