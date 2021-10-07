const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Post = require("../models/Post");
// const nodemailer = require("nodemailer")
const { serverError, resourceError } = require("../utils/error");
const postValidator = require("../validator/postValidator");

module.exports = {
  
  create(req, res) {
    let {
      title,
      description,
      image,
      category,
      tag,
      author,
      comments,
      isPublished,
    } = req.body;
    // console.log(req.body);
    let validate = postValidator({ title, description, category, tag, author });


//     console.log(root)
// return res.status(200).json({message: 'okay'})

    if (!validate.isValid) {
      return res.status(400).json(validate.error);
    } else {
      
      // if image has uploaded
      if(req.files != null){
        const dir =  "./uploads";
        // const dir = `${__dirname }/../../../../` + "uploads";
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        if (req.files === null) {
          return res.status(400).json({ file: "No file uploaded" });
        }
        let file = req.files.file;

        var filePath = `/uploads/` + Date.now() + `-${file.name}`;


        const root = path.resolve('./')
        file.mv(
          `${root}/uploads/` + Date.now() + `-${file.name}`,
          (err) => {
            if (err) { 
              // console.log(err);
              // return res.status(500).json(err);
              return res.json({ success: false,message: "image not uploaded", error: err });
            }
          }
        );
      }
    

      let post = new Post({
        title,
        description, 
        image,
        category,
        tag,
        author,
        image: filePath || 'null',
        comments,
        isPublished,
      });

      post
        .save()
        .then((post) => {
          return res.json({ success: true,message: "User Created Successfully", data: post });
        })
        .catch((error) => serverError(res, error));
    }
  }, 

  getAll(req, res) {
    // console.log('test')
    Post.find()
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
         
          return res.json({ success: true, data: posts });
        }
      })
      .catch((error) => serverError(res, error));
  },

  getSinglePost(req, res) {
    let { id } = req.params;
    Post.findById(id)
      .then((post) => {
        if (!post) {
          return res.status(200).json({
            message: "No post Found",
          });
        } else {
         return res.json({ success: true, data: post });
        } 
      })
      .catch((error) => serverError(res, error));
  },

  update(req, res) {
    let { id } = req.params;
    let { title, description, category, tag } = req.body;
    Post.findById(id)
      .then((post) => {
        post.title = title;
        post.description = description;
        post.category = category;
        post.tag = tag;
        Post.findOneAndUpdate({ _id: id }, { $set: post }, { new: true })
          .then((result) => {
            return res.json({ success: true, message: "Post Updated Successfully", data: result });
          })
          .catch((error) => serverError(res, error));
      })
      .catch((error) => serverError(res, error));
  },

  remove(req, res) {
    let { id } = req.params;
    Post.findOneAndDelete({ _id: id })
      .then((result) => {
        if (result == null) {
          return res.status(404).json({
            message: "No Post Found",
          });
        }else{
          return res.json({ success: true, message: 'Post deleted successfully', data: result });
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

  imageUpload(req, res) {
    const { id } = req.params;
    if (req.files === null) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const file = req.files.file;

    var filePath = `/uploads/` + Date.now() + `-${file.name}`;

    const root = path.resolve('./')
        file.mv(
          `${root}/uploads/` + Date.now() + `-${file.name}`,
          (err) => {
            if (err) { 
              // console.log(err);
              // return res.status(500).json(err);
              return res.json({ success: false, message: "image not uploaded", error: err });
            }
          }
        )

        post
          .findById(id)
          .then((post) => {
            post.image = filePath;
            post
              .findOneAndUpdate({ _id: id }, { $set: post }, { new: true })
              .then((result) => {
                return res.json({success: true, message: "image uploaded successfully"})
              })
              .catch((error) => serverError(res, error));
          })
          .catch((error) => serverError(res, error));
  },

  searchQuery(req, res) {
    // console.log('hello')
    try {
      const { query } = req.params;

      if (query.trim()) {

        Post.find()
          .then((data) =>  {
            // console.log(data)
           const newData = data.filter((post) =>
              post.title.toLowerCase().includes(query.toLowerCase())
            );

            if (newData.length === 0){
              return res.json({ success: false, message: "No match found.." });
            }else{
              return res.json({ success: true, data: newData });
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
