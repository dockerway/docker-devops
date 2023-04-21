import mongoose from "mongoose"; 



const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const StackSchema = new Schema({ 
 name: {type: String, required: true, unique: true, index: true},
 platform: {type: mongoose.Schema.Types.ObjectId, ref: "Platform", required: false, unique: false, index: false},
 environments: [{type: mongoose.Schema.Types.ObjectId, ref: "Environment",required: false, unique: false, index: false}]
});

StackSchema.plugin(mongoosePaginate);
StackSchema.plugin(uniqueValidator, {message: 'validation.unique'});

const Stack = mongoose.model('Stack', StackSchema);

module.exports = Stack;