// const { findById } = require('../model/Comment')
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { serverError, resourceError } = require("../utils/error");
const commentValidator = require("../validator/commentValidator");

module.exports = {
  
  create(req, res) {
    let { name, email, website, comment, id } = req.body;

    let validate = commentValidator({ name, email, comment });

    if (!validate.isValid) {
      return res.status(400).json(validate.error);
    } else {
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
    }
  },

  getAll(req, res) {
    // for specific post
    let _id = req.params.id;

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

  getSingleComment(req, res) {
    let { commentId } = req.params;
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

  update(req, res) {
    let { commentId } = req.params;
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

  remove(req, res) {
    let { commentId } = req.params;
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
