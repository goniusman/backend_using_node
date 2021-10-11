const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema
const VTokenSchema = new Schema({

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true, 
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now()
  }

})

VTokenSchema.pre('save', async function (next) {
  if(this.isModified("token")){
    const hash = await bcrypt.hash(this.token, 8);
    this.token = hash
  }
  next()
})

VTokenSchema.methods.compareToken = async function (otp) {
  const result = await bcrypt.compareSync(otp, this.token);
  return result; 
}


const VToken = mongoose.model('VToken', VTokenSchema)

module.exports = VToken