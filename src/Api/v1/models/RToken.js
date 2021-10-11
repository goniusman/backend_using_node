const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema
const RTokenSchema = new Schema({

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

RTokenSchema.pre('save', async function (next) {
  if(this.isModified("token")){
    const hash = await bcrypt.hash(this.token, 8);
    this.token = hash
  }
  next()
})

RTokenSchema.methods.compareToken = async function (otp) {
  const result = await bcrypt.compareSync(otp, this.token);
  return result; 
}


const RToken = mongoose.model('RToken', RTokenSchema)

module.exports = RToken