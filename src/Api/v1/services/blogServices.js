const fs = require("fs");
const path = require("path");
const multer = require("multer");

const redisclient = require("../utils/cache");
const Post = require("../models/Post");
// const nodemailer = require("nodemailer")
const { serverError, resourceError } = require("../utils/error");
const postValidator = require("../validator/postValidator");
// const winston = require('../../../log');

module.exports = {

 async create(res, {title,description,image,category,tag,author,comments,isPublished},filePath) {

      let post = new Post({
        title,
        description,
        image,
        category,
        tag,
        author,
        image: filePath || "null",
        comments,
        isPublished,
      });

     await post
        .save()
        .then((post) => {
          return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            data: post,
          });
        })
        .catch((error) => serverError(res, error));
    
  },

  async getAll(res) {
    
      await Post.find()
        // .limit(2)
        .then((posts) => {
          if (posts.length === 0) {
            return res.status(200).json({
              message: "No Post Found",
            });
          } else {
            // delete posts.description;
            const { description, image } = posts;

            // return res.status(200).json(posts);
            redisclient().setex("posts", 600, JSON.stringify(posts));

             res.status(200).json({ success: true, data: posts });
          }
        })
        .catch((error) => serverError(res, error));
   
  },

  getSinglePost(res,id) {

    Post.findById(id)
      .then((post) => {
        if (!post) {
          return res.status(200).json({
            message: "No post Found",
          });
        } else {
          redisclient().setex(`post_${id}`, 600, JSON.stringify(post));
          return res.json({ success: true, data: post });
        }
      })
      .catch((error) => serverError(res, error));
     
  },

  update(res,id, title,description,category,tag) {
    Post.findById(id)
      .then((post) => {
        post.title = title;
        post.description = description;
        post.category = category;
        post.tag = tag;
        Post.findOneAndUpdate({ _id: id }, { $set: post }, { new: true })
          .then((result) => {
            return res.status(201).json({
              success: true,
              message: "Post Updated Successfully",
              data: result,
            });
          })
          .catch((error) => serverError(res, error));
      })
      .catch((error) => serverError(res, error));
  },

  remove(res,id) {
   Post.findOneAndDelete({ _id: id })
      .then((result) => {
        if (result == null) {
          return res.status(404).json({
            message: "No Post Found",
          });
        } else {
          return res.json({
            success: true,
            message: "Post deleted successfully",
            data: result,
          });
        }
      })
      .catch((error) => serverError(res, error));
  },

  toogleUpdate(res,id) {
    
    Post.findById(id)
      .then((post) => {
        post.like = post.like + 1;
        Post.findOneAndUpdate({ _id: id }, { $set: post }, { new: true })
          .then((result) => {
            console.log(result);
            return res.status(201).json({
              message: "Updated Successfully Solved",
              ...result._doc,
            });
          })
          .catch((error) => serverError(res, error));
      })
      .catch((error) => serverError(res, error));
  },

  imageUpload(res,id, filePath) {
   

    Post.findById(id)
      .then((post) => {
        post.image = filePath;
        post
          .findOneAndUpdate({ _id: id }, { $set: post }, { new: true })
          .then((result) => {
            return res.status(201).json({
              success: true,
              message: "image uploaded successfully",
            });
          })
          .catch((error) => serverError(res, error));
      })
      .catch((error) => serverError(res, error));
  },

 async searchQuery(res,query) {

    try {

      if (query.trim()) {
        await Post.find()
          .then((data) => {
            // console.log(data)
            const newData = data.filter((post) =>
              post.title.toLowerCase().includes(query.toLowerCase())
            );

            if (newData.length === 0) {
              return res.status(404).json({ success: false, message: "No match found.." });
            } else {
              return res.status(200).json({ success: true, data: newData });
            }
          })
          .catch((error) => serverError(res, error));
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Something went wrong, server error!",
      });
  
    }
  },

};
