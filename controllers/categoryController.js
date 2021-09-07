// const { findById } = require('../model/cat')
const Category = require("../models/Category");
const { serverError, resourceError } = require("../utils/error");
const categoryValidator = require("../validator/categoryValidator");

module.exports = {
  create(req, res) {
    let { category, description } = req.body;

    let validate = categoryValidator({ category, description });

    if (!validate.isValid) {
      return res.status(400).json(validate.error);
    } else {
      Category.findOne({ category }).then((cat) => {
        if (cat) {
          return resourceError(res, "Category Already Exist");
        }
        let categories = new Category({ category, description });
        categories
          .save()
          .then((cat) => {
            return res.status(201).json({
              message: "Created Category",
              cat,
            });
          })
          .catch((error) => serverError(res, error));
      });
    }
  },

  getAll(req, res) {
    Category.find()
      .then((cats) => {
        if (cats.length === 0) {
          return res.status(200).json({
            message: "No Cat Found",
          });
        } else {
          return res.status(200).json(cats);
        }
      })
      .catch((error) => serverError(res, error));
  },

  getSingleCategory(req, res) {
    let { id } = req.params;

    Category.findById(id)
      .then((cat) => {
        if (!cat) {
          return res.status(200).json({
            message: "No cat Found",
          });
        } else {
          return res.status(200).json(cat);
        }
      })
      .catch((error) => serverError(res, error));
  },

  update(req, res) {
    let { id } = req.params;
    let { category, description } = req.body;
    Category.findById(id)
      .then((cat) => {
        cat.category = category;
        cat.description = description;
        cat
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

  remove(req, res) {
    let { id } = req.params;
    Category.findOneAndDelete({ _id: id })
      .then((result) => {
        return res.status(204).json({
          message: "Deleted Successfully",
          ...result._doc,
        });
      })
      .catch((error) => serverError(res, error));
  },
};
