const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CategoryModel = new Schema({
    category: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
}, {timestamps:true} )

const Category = mongoose.model('Category', CategoryModel)
module.exports = Category

