// const { findById } = require('../model/Comment')
const { result } = require("lodash");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { serverError, resourceError } = require("../utils/error");
const commentValidator = require("../validator/commentValidator");

module.exports = {
  
  async create( res, comment, postId, userId ) {
    
      let comments = new Comment({ comment, postId, userId  });
     await comments
        .save()
        .then( async (comment) => {
         await Post.findById(postId)
            .then( async (post) => {
              post.comments.unshift(comment._id);
              await post
                .save()
                .then((post) => {
                  return res.status(201).json({success: true, message: "Comment Saved Successfully", comment: comment});
                })
                .catch((error) => serverError(res, error));
            })
            .catch((error) => serverError(res, error));
        })
        .catch((error) => serverError(res, error));
    
  },

  async getAll(res,_id) {

    await Comment.find({ postId: _id })
      .then( (comments) => {
        if (comments.length === 0) {
          return res.status(200).json({success: true, message: "No Comments for this post", comments:[]});
        } else {
          return res.status(200).json({success: true, comments});
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

  async update(res, body, commentId) {
    await Comment.findById(commentId)
      .then(async resut => {
        if(resut != null){
          resut.comment = body
            await Comment.findOneAndUpdate(
            { _id: commentId },
            { $set: resut },
            { new: true }
          )
            .then((result) => {
              res.status(200).json({
                message: "Updated Successfully",
                ...result._doc
              });
            })
            .catch((error) => serverError(res, error));
            }
          })
      .catch(err => serverError(res, err))
   
  },

  async remove(res, cid, pid) {

    await Comment.findById(cid)
      .then(async c => {
        console.log(c)
        if(c == null){
          return res.status(200).json({success: false, message: "No Comment Found"})
        }else{
          await Comment.findOneAndDelete({ _id: cid })
          .then( async (result) => {
            Post.findById(pid)
              .then(p => {
               
                  let comment = p.comments
                  const index = comment.indexOf(cid);
                  if (index > -1) {
                    comment.splice(index, 1); // 2nd parameter means remove one item only
                  }
                  Post.findOneAndUpdate({ _id: pid }, { $set: p }, { new: true })
                    .then(r => {
                      return res.status(200).json({success: true, message: "Comment deleted and Comment Id from post"})
                    })
                    .catch(err => resourceError(res, err))
    
              })
              .catch(err => resourceError(res, err))
          })
          .catch((error) => serverError(res, error));
    
        }
      })
      .catch()



 

          // res.status(200).json({
          //   message: "Deleted Successfully",
          //   ...result._doc
          // });

  },

};
