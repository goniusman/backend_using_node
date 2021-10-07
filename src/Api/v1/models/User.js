const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: false,
        trim: true
    },
    username: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: false, 
        default:'Customer'
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: Buffer
    },
    tokens: [{ type: Object }],
    
}, {timestamps: true})

const User = mongoose.model('User', userSchema)

module.exports = User