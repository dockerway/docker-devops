const mongoose = require('mongoose');


const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const EnvSchema = new Schema({
    name: {type: String, required: true, index: false},
    value: {type: String, required: false, index: false},
})

const LabelSchema = new Schema({
    name: {type: String, required: true, index: false},
    value: {type: String, required: false, index: false},
})

const ConstraintSchema = new Schema({
    name: {type: String, required: false, index: false},
    operation: {type: String, required: false, index: false},
    value: {type: String, required: false, index: false},
})

const LimitSchema = new Schema({
    memoryReservation: {type: Number, required: false, index: false},
    memoryLimit: {type: Number, required: false, index: false},
    CPUReservation: {type: Number, required: false, index: false},
    CPULimit: {type: Number, required: false, index: false},
})

const PreferenceSchema = new Schema({
    name: {type: String, required: false, index: false},
    value: {type: String, required: false, index: false},
})

const PortSchema = new Schema({
    hostPort: {type: String, required: true, index: false},
    containerPort: {type: String, required: false, index: false},
})

const VolumeSchema = new Schema({
    hostVolume: {type: String, required: true, index: false},
    containerVolume: {type: String, required: false, index: false},
})

const FileSchema = new Schema({
    fileName: {type: String, required: true, index: false},
    fileContent: {type: String, required: true, index: false},
    hostPath: {type: String, required: true, index: false},
    containerPath: {type: String, required: false, index: false},
})

const EnvironmentServiceSchema = new Schema({
    environment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Environment",
        required: true,
        unique: false,
        index: false
    },
    service: {type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true, unique: false, index: false},
    stack: {type: mongoose.Schema.Types.ObjectId, ref: "Stack", required: true, unique: false, index: false},
    image: {type: String, required: true, index: false},
    name: {type: String, required: true, index: false},
    replicas: {type: Number, required: true, index: false, default: 1},
    envs: [EnvSchema],
    ports: [PortSchema],
    volumes: [VolumeSchema],
    files: [FileSchema],
    labels: [LabelSchema],
    constraints: [ConstraintSchema],
    limits: LimitSchema,
    preferences: [PreferenceSchema],
    command: {type: String, required: false, index: false}
}, {timestamps: true});


EnvironmentServiceSchema.plugin(mongoosePaginate);
EnvironmentServiceSchema.plugin(uniqueValidator, {message: 'validation.unique'});

const EnvironmentService = mongoose.model('EnvironmentService', EnvironmentServiceSchema);

module.exports = EnvironmentService;
