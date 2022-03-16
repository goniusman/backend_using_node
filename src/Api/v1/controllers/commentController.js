// const { findById } = require('../model/Comment')
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { serverError, resourceError } = require("../utils/error");
const commentValidator = require("../validator/commentValidator");
const { create, getAll, remove, getSingleComment, update} = require("../services/commentServices");

module.exports = {
  
  create(req, res) {
    let { name, email, website, comment, id } = req.body;

    let validate = commentValidator({ name, email, comment });

    if (!validate.isValid) {
      return res.status(400).json(validate.error);
    } else {
     return create(res, name, email, website, comment,  id )
    }
  },

  getAll(req, res) {
    // for specific post
    let _id = req.params.id;

    return getAll(res,_id)
  },

  getSingleComment(req, res) {
    let { commentId } = req.params;
   return getSingleComment(res,commentId)
  },

  update(req, res) {
    let { commentId } = req.params;
   return update(res, commentId)
  },

  remove(req, res) {
    let { commentId } = req.params;
    return remove(res, commentId)
  },

};
