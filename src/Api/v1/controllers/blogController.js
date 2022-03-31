const fs = require("fs");
const path = require("path");
const multer = require("multer");

const redisclient = require("../utils/cache");
const Post = require("../models/Post");
// const nodemailer = require("nodemailer")
const { serverError, resourceError } = require("../utils/error");
const postValidator = require("../validator/postValidator");
const { infoLogger } = require('../../../logger');

const {
  create,
  getAll,
  getSinglePost,
  update,
  remove,
  toogleUpdate,
  searchQuery,
  imageUpload,
  getPostByCategory
} = require("../services/blogServices");


module.exports = {
  async create(req, res) {
    let {
      title,
      description,
      image,
      category,
      tag,
      comments,
      isPublished
    } = req.body;
    // console.log(req.headers)   

    // let { name } = req.user;

    let validate = postValidator({ title, description, category, tag });

    if (!validate.isValid) {
      return res.status(400).json(validate.error);
    } else {

       ////if image have than uploaded
      if (req.files != null) {
        const dir = "./uploads";
        // const dir = `${__dirname }/../../../../` + "uploads";
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        if (req.files === null) {
          return res.status(400).json({ file: "No file uploaded" });
        }
        let file = req.files.file;

        var filePath = `/uploads/` + Date.now() + `-${file.name}`;

        const root = path.resolve("./");
        file.mv(`${root}/uploads/` + Date.now() + `-${file.name}`, (err) => {
          if (err) {
            // console.log(err);
            // return res.status(500).json(err);
            return res.json({
              success: false,
              message: "image not uploaded",
              error: err,
            });
          }
        });
      }

      return await create(res, {title,description,category,tag,author: 'default',isPublished}, filePath)
      
    }
  },

  async getAll(req, res) {
    // console.log('i am from native') 
    // winston.info('I am here this is your point post file\n')
    infoLogger()
    redisclient().get("posts", async (err, jobs) => {
      if (err) throw err;
 
      if (jobs) {
        return res.json({ 
          post: JSON.parse(jobs),
          message: "data retrieved from the cache",
          success: true
        });
      } else { 

         return await getAll(res)
      }
    });
  },

  async getSinglePost(req, res) {
    let { id } = req.params;
    // console.log('i am single')
    redisclient().get(`post_${id}`, async (err, jobs) => {
      if (err) throw err;

      if (jobs) {
       return res.status(200).send({
          data: JSON.parse(jobs),
          message: "data retrieved from the cache",
          success: true
        });
      } else {


       return await getSinglePost(res,id);


      }
    });
  },

  async getPostByCategory(req, res){
    const {category, qty} = req.params
    let q = qty ? Number(qty) : 0

    infoLogger()
    redisclient().get(`posts_by_${category}`, async (err, jobs) => {
      if (err) throw err;
 
      if (jobs) {
        return res.json({ 
          post: JSON.parse(jobs),
          message: "post by category retrived from the cache",
          success: true
        });
      } else { 

        return await getPostByCategory(res, category, q)
      }
    });

  },

  async update(req, res) {
    let { id } = req.params;
    let { title, description, category, tag } = req.body;
      return await update(res,id, title,description,category,tag) 
  },

  remove(req, res) {
    let { id } = req.params;
    return remove(res,id);
  },

  async toogleUpdate(req, res) {
    let { id } = req.params;
    return await toogleUpdate(res,id);
  },

  async imageUpload(req, res) {
    const { id } = req.params;
    if (req.files === null) {
      return res.json({ message: "No file uploaded" });
    }

    const file = req.files.file;

    var filePath = `/uploads/` + Date.now() + `-${file.name}`;

    const root = path.resolve("./");
    file.mv(`${root}/uploads/` + Date.now() + `-${file.name}`, (err) => {
      if (err) {
        // console.log(err);
        // return res.status(500).json(err);
        return res.json({
          success: false,
          message: "image not uploaded",
          error: err,
        });
      }
    });

    return await imageUpload(res, id, filePath)
  },

  async searchQuery(req, res) {
    // console.log('hello')
    const { query } = req.params;
   return await searchQuery(res,query)
  },

};
