const mongoose = require('mongoose');



const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const PlatformSchema = new Schema({

 name: {type: String, required: true, unique: true, index: true}


}, { timestamps: true });




PlatformSchema.plugin(mongoosePaginate);
PlatformSchema.plugin(uniqueValidator, {message: 'validation.unique'});

const Platform = mongoose.model('Platform', PlatformSchema);

module.exports = Platform;
