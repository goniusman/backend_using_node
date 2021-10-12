const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
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

    verified: {
        type: Boolean,
        default: false,
        required: true, 
    }
    
}, {timestamps: true})



  userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
      bcrypt.hash(this.password, 8, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
      });
    }
  });
  
  userSchema.methods.comparePassword = async function (password) {
    if (!password) throw new Error('Password is mission, can not compare!');
  
    try {
      const result = await bcrypt.compare(password, this.password);
      return result;
    } catch (error) {
      console.log('Error while comparing password!', error.message);
    }
  };
  
  userSchema.statics.isThisEmailInUse = async function (email) {
    if (!email) throw new Error('Invalid Email');
    try {
      const user = await this.findOne({ email });
      if (user) return false;
  
      return true;
    } catch (error) {
      console.log('error inside isThisEmailInUse method', error.message);
      return false;
    }
  };


const User = mongoose.model('User', userSchema)

module.exports = User