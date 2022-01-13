// const { findById } = require('../model/Comment')
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { serverError, resourceError } = require("../utils/error");
const commentValidator = require("../validator/commentValidator");

module.exports = {
  
  create(res, name, email, website, comment,  id ) {
    
      let comments = new Comment({ name, email, website, comment, postId: id });
      comments
        .save()
        .then((comment) => {
          Post.findById(id)
            .then((post) => {
              post.comments.unshift(comment._id);
              post
                .save()
                .then((post) => {
                  return res.status(201).json({success: true, message: "okay"});
                })
                .catch((error) => serverError(res, error));
            })
            .catch((error) => serverError(res, error));
        })
        .catch((error) => serverError(res, error));
    
  },

  getAll(res,_id) {

    Comment.find({ postId: _id })
      .then((comments) => {
        if (comments.length === 0) {
          return res.status(200).json([]);
        } else {
          return res.status(200).json(comments);
        }
      })
      .catch((error) => serverError(res, error));
  },

  getSingleComment(res, commentId) {

    Comment.findById(commentId)
      .then((comment) => {
        if (!comment) {
          res.status(200).json({
            message: "No Comment Found",
          });
        } else {
          res.status(200).json(comment);
        }
      })
      .catch((error) => serverError(res, error));
  },

  update(res, commentId) {

    Comment.findOneAndUpdate(
      { _id: commentId },
      { $set: req.body },
      { new: true }
    )
      .then((result) => {
        res.status(200).json({
          message: "Updated Successfully",
          // comment: result
        });
      })
      .catch((error) => serverError(res, error));
  },

  remove(res, commentId) {

    Comment.findOneAndDelete({ _id: commentId })
      .then((result) => {
        res.status(200).json({
          message: "Deleted Successfully",
          // ...result._doc
        });
      })
      .catch((error) => serverError(res, error));
  },

};
