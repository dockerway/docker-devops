const mongoose = require('mongoose'); 



const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const StackSchema = new Schema({ 

 name: {type: String, required: true, unique: true, index: true}


});




StackSchema.plugin(mongoosePaginate);
StackSchema.plugin(uniqueValidator, {message: 'validation.unique'});

const Stack = mongoose.model('Stack', StackSchema);

module.exports = Stack;