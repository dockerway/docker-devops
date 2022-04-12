const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const EnvSchema = new Schema({
    name: {type: String, required: true, index: false},
    defaultValue: {type: String, required: false, index: false},
})

const ConstraintSchema = new Schema({
    name: {type: String, required: false, index: false},
    operation: {type: String, required: false, index: false},
    defaultValue: {type: String, required: false, index: false},
})

const LimitSchema = new Schema({
    memoryReservation: {type: Number, required: false, index: false},
    memoryLimit: {type: Number, required: false, index: false},
    CPUReservation: {type: Number, required: false, index: false},
    CPULimit: {type: Number, required: false, index: false},
})

const ServiceSchema = new Schema({
    name: {type: String, required: true, unique: false, index: false},
    description: {type: String, required: false, unique: false, index: false},
    platform: {type: mongoose.Schema.Types.ObjectId, ref: "Platform", required: true, unique: false, index: false},
    image: {type: String, required: false, unique: false, index: false},
    repository: {type: String, required: false, unique: false, index: false},
    volumes: [{type: String, required: false}],
    ports: [{type: Number, required: false}],
    envs: [EnvSchema],
    constraints: [ConstraintSchema],
    limits: LimitSchema
}, { timestamps: true });


ServiceSchema.index({ name: 1, platform: 1}, { unique: true });

ServiceSchema.plugin(mongoosePaginate);
ServiceSchema.plugin(uniqueValidator, {message: 'validation.unique'});

const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;
