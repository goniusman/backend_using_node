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
  create(res, {title,description,category,tag,author,isPublished}, filePath) {
    
      let post = new Post({
        title,
        description,
        category,
        tag,
        author,
        image: filePath || "null",
        isPublished,
      });

      post
        .save()
        .then((post) => {
          return res.json({
            success: true,
            message: "Post Created Successfully",
            data: post,
          });
        })
        .catch((error) => serverError(res, error));
    
  },

  async getAll( res) {
 
        await Post.find()
          // .limit(2)
          .then((posts) => {
            if (posts.length === 0) {
              return res.status(200).json({
                message: "No Post Found",
              });
            } else {
              // delete posts.description and image and use withoutDescImage;
              // const { description, image, ...withoutDescIamge } = posts; 

              // return res.status(200).json(posts);
              redisclient().setex("posts", 600, JSON.stringify(posts));

              return res.json({ success: true, post: posts  });
            }
          })
          .catch((error) => serverError(res, error));
 
  
  },

  async getSinglePost(res, id) {
    // let { id } = req.params;
    // console.log(req.params)
    // // console.log('i am single')
    // redisclient().get(`post_${id}`, async (err, jobs) => {
    //   if (err) throw err;

    //   if (jobs) {
    //     res.status(200).send({
    //       jobs: JSON.parse(jobs),
    //       message: "data retrieved from the cache",
    //     });
    //   } else {
      await  Post.findById(id)
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
    //   }
    // });
  },

  async getPostByCategory(res, cat, qty){
    await Post.find({category: cat}).limit(qty)
      .then(cats => {
        if(cats.length !== 0){
          redisclient().setex(`posts_by_${cat}`, 600, JSON.stringify(cats));
          return res.status(200).json({success: true, post: cats})
        }else{
          return res.status(200).json({success: true, message: "No post found on this category"})
        }
      })
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
            return res.json({
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

  toogleUpdate(req, res) {
    let { id } = req.params;
    Post.findById(id)
      .then((post) => {
        post.like = post.like + 1;
        Post.findOneAndUpdate({ _id: id }, { $set: post }, { new: true })
          .then((result) => {
            console.log(result);
            return res.status(200).json({
              message: "Updated Successfully Solved",
              ...result._doc,
            });
          })
          .catch((error) => serverError(res, error));
      })
      .catch((error) => serverError(res, error));
  },

  imageUpload(res, id, filePath) {
    // const { id } = req.params;
    // if (req.files === null) {
    //   return res.status(400).json({ msg: "No file uploaded" });
    // }

    // const file = req.files.file;

    // var filePath = `/uploads/` + Date.now() + `-${file.name}`;

    // const root = path.resolve("./");
    // file.mv(`${root}/uploads/` + Date.now() + `-${file.name}`, (err) => {
    //   if (err) {
    //     // console.log(err);
    //     // return res.status(500).json(err);
    //     return res.json({
    //       success: false,
    //       message: "image not uploaded",
    //       error: err,
    //     });
    //   }
    // });

    post
      .findById(id)
      .then((post) => {
        post.image = filePath;
        post
          .findOneAndUpdate({ _id: id }, { $set: post }, { new: true })
          .then((result) => {
            return res.json({
              success: true,
              message: "image uploaded successfully",
            });
          })
          .catch((error) => serverError(res, error));
      })
      .catch((error) => serverError(res, error));
  },

  searchQuery(res, query) {
    // console.log('hello')
    try {
      if (query.trim()) {
        Post.find()
          .then((data) => {
            // console.log(data)
            const newData = data.filter((post) =>
              post.title.toLowerCase().includes(query.toLowerCase())
            );

            if (newData.length === 0) {
              return res.json({ success: false, message: "No match found.." });
            } else {
              return res.json({ success: true, post: newData });
            }
          })
          .catch((error) => serverError(res, error));
      }
    } catch (error) {
      res.json({
        success: false,
        message: "Something went wrong, server error!",
      });
      console.log(error);
    }
  },
};
