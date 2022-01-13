const fs = require("fs");
const path = require("path");
const multer = require("multer");

const redisclient = require("../utils/cache");
const Post = require("../models/Post");
// const nodemailer = require("nodemailer")
const { serverError, resourceError } = require("../utils/error");
const postValidator = require("../validator/postValidator");
// const winston = require('../../../log');

const {
  create,
  getAll,
  getSinglePost,
  update,
  remove,
  toogleUpdate,
  searchQuery,
} = require("../services/blogServices");


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

    let validate = postValidator({ title, description, category, tag, author });

    if (!validate.isValid) {
      return res.status(400).json(validate.error);
    } else {

       ////if image has uploaded
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

      return await create(res, {title,description,image,category,tag,author,comments,isPublished}, filePath)
      
    }
  },

  async getAll(req, res) {
    // console.log('test')
    // winston.info('I am here this is your point post file\n')
    redisclient().get("posts", async (err, jobs) => {
      if (err) throw err;

      if (jobs) {
        res.status(200).send({
          jobs: JSON.parse(jobs),
          message: "data retrieved from the cache",
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
          jobs: JSON.parse(jobs),
          message: "data retrieved from the cache",
        });
      } else {


       return await getSinglePost(res,id);


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

  toogleUpdate(req, res) {
    let { id } = req.params;
    return await toogleUpdate(res,id);
  },

  imageUpload(req, res) {
    const { id } = req.params;
    if (req.files === null) {
      return res.status(400).json({ msg: "No file uploaded" });
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

    return await imageUpload(res,id, filePath)
  },

  async searchQuery(req, res) {
    // console.log('hello')
    const { query } = req.params;
   return await searchQuery(res,query)
  },

};
