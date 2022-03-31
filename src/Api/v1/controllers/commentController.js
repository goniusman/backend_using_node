// const { findById } = require('../model/Comment')
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { serverError, resourceError } = require("../utils/error");
const commentValidator = require("../validator/commentValidator");
const { create, getAll, remove, getSingleComment, update} = require("../services/commentServices");

module.exports = {
  
  async create(req, res) {
    let { comment, postId } = req.body;
    let {_id : userId} = req.user

    let validate = commentValidator({ comment, postId });

    if (!validate.isValid) {
      return await res.status(400).json(validate.error);
    } else {
      return await create(res, comment, postId, userId )
    }
  },

  async getAll(req, res) {
    // for specific post
    let id = req.params.id;

    return await getAll(res,id)
  },

  getSingleComment(req, res) {
    let id = req.params.id;
   return getSingleComment(res,commentId)
  },

  async update(req, res) {
    let id = req.params.id;
    let {comment} = req.body
   return await update(res, comment, id)
  },

  async remove(req, res) {
    let { cid, pid } = req.params;
    return await remove(res, cid, pid)
  },

};
