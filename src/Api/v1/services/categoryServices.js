// const { findById } = require('../model/cat')
const redisclient = require("../utils/cache");
const Category = require("../models/Category");
const { serverError, resourceError } = require("../utils/error");
const categoryValidator = require("../validator/categoryValidator");

module.exports = {

  create(res,category, description) {

      Category.findOne({ category }).then((cat) => {
        if (cat) {
          return resourceError(res, "Category Already Exist");
        }
        let categories = new Category({ category, description });
        categories
          .save()
          .then((cat) => {
            return res.json({
              success: true,
              message: "Category Created Successfully",
              data: cat,
            });
          })
          .catch((error) => serverError(res, error));
      });
    
  },

  getAll(res) {

      Category.find()
        .then((cats) => {
          if (cats.length === 0) {
            return res.status(200).json({
              message: "No Cat Found",
            });
          } else {
            // console.log('from database')
            redisclient().setex("cat", 600, JSON.stringify(cats));
            return res.json({ success: true, data: cats, message: "Fetch from databases" });
          
          } 
        })
        .catch((error) => serverError(res, error));

  },

  getSingleCategory(res,id) {


    Category.findById(id)
      .then((cat) => {
        if (!cat) {
          return res.status(200).json({
            message: "No cat Found",
          });
        } else {
          return res.json({
            success: true,
            message: "Fetched From databases",
            data: cat,
          });
        }
      })
      .catch((error) => serverError(res, error));
  },

  update(res, category, description,id) {

    Category.findById(id)
      .then((cat) => {
        cat.category = category;
        cat.description = description;
        Category
          .findOneAndUpdate({ _id: id }, { $set: cat }, { new: true })
          .then((result) => {
            return res.status(200).json({
              message: "Updated Successfully",
              ...result._doc,
            });
          })
          .catch((error) => serverError(res, error));
      })
      .catch((error) => serverError(res, error));
  },

  remove(res,id) {

    Category.findOneAndDelete({ _id: id })
      .then((result) => {
        if(result == null){
          return res.json({success: true, message: "Category not found"})
        }else{
          return res.status(204).json({
            message: "Deleted Successfully",
            data: result
          });
        }
      })
      .catch((error) => serverError(res, error));
  },

};
