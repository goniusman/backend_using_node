const multer = require("multer");
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

    if (!validate.isValid) {
      return res.status(400).json(validate.error);
    } else {
      // const dir = "./uploads";
      // if (!fs.existsSync(dir)) {
      //   fs.mkdirSync(dir);
      // }
      // if (req.files === null) {
      //   return res.status(400).json({ file: "No file uploaded" });
      // }
      // let file = req.files.file;

      // let filePath = `/uploads/` + Date.now() + `-${file.name}`;
      // file.mv(
      //   `${__dirname}/../client/public/uploads/` + Date.now() + `-${file.name}`,
      //   (err) => {
      //     if (err) {
      //       console.log(err);
      //       return res.status(500).json(err);
      //     }
      //   }
      // );

      let post = new Post({
        title,
        description,
        image,
        category,
        tag,
        author,
        image: 'filePath',
        comments,
        isPublished,
      });
      post
        .save()
        .then((post) => {
          console.log(post);
          return res.status(201).json({
            ...post._doc,
          });
        })
        .catch((error) => serverError(res, error));
    }
  },

  getAll(req, res) {
    Post.find()
      // .limit(5)
      .then((posts) => {
  
        if (posts.length === 0) {
          return res.status(200).json({
            message: "No Post Found",
          });
        } else {
          // delete posts.description;
          const { description, image } = posts;
       
          // return res.status(200).json(posts);
         
          res.json({ success: true, data: posts });
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

          
          res.json({ success: true, data: post });
          // return res.status(200).json(post);
        } 
      })
      .catch((error) => serverError(res, error));
  },

  update(req, res) {
    let { id } = req.params;
    let { title, description, category, tag } = req.body;
    console.log(req.body);
    Post.findById(id)
      .then((post) => {
        post.title = title;
        post.description = description;
        post.category = category;
        post.tag = tag;
        Post.findOneAndUpdate({ _id: id }, { $set: post }, { new: true })
          .then((result) => {
            // return res.status(201).json({
            //   message: "Updated Successfully",
            //   ...result._doc,
            // });

            return res.json({ success: true, message: "Post Updated Successfully", data: result });
            // console.log(result)

          })
          .catch((error) => serverError(res, error));
      })
      .catch((error) => serverError(res, error));
  },

  remove(req, res) {
    let { id } = req.params;
    Post.findOneAndDelete({ _id: id })
      .then((result) => {
        return res.json({ success: true });
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

    file.mv(`${__dirname}/../client/public/uploads/${file.name}`, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      post
        .findById(id)
        .then((post) => {
          post.image = `/uploads/${file.name}`;
          post
            .findOneAndUpdate({ _id: id }, { $set: post }, { new: true })
            .then((result) => {
              return res.status(200).json({
                message: "Image Updated Successfully",
                ...result._doc,
              });
            })
            .catch((error) => serverError(res, error));
        })
        .catch((error) => serverError(res, error));

      // res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    });
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
