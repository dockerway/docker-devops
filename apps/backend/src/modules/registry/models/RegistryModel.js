const mongoose = require('mongoose');



const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema

const RegistrySchema = new Schema({

 name: {type: String, required: true, unique: true, index: true},
 url: {type: String, required: true, unique: true, index: true},
 auth: {type: Boolean, required: false, index: false},
 username: {type: String, required: false, unique: false, index: false},
 password: {type: String, required: false, unique: false, index: false}

})


RegistrySchema.virtual('domain').get(function() {
 return this.url.replace(/http(s)?:\/\//, "")
})

RegistrySchema.plugin(mongoosePaginate);
RegistrySchema.plugin(uniqueValidator, {message: 'validation.unique'})

const Registry = mongoose.model('Registry', RegistrySchema)

module.exports = Registry;
