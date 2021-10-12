const {isValidObjectId} = require('mongoose')

const User = require('../models/User')
const RToken = require('../models/RToken')
const { serverError, resourceError } = require("../utils/error");

exports.isResetTokenValid = async (req, res, next) => {
  const {token, id} = req.query;
  if(!token || !id) return resourceError(res, "Invalid Request")

  if(!isValidObjectId(id)) return resourceError(res, "Invalid User")

  const user = await User.findById(id)
  if(!user) return resourceError(res, "User not found")

  const rtoken = await RToken.findOne({owner:user.id})
  if(!rtoken) return resourceError(res, "Reset Token not found")


  const isValid = await rtoken.compareToken(token)
  if(!isValid) return resourceError(res, "Reset Token is invalid")

  req.user = user

  next()
}