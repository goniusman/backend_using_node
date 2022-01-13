// const { findById } = require('../model/cat')
const redisclient = require("../utils/cache");
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
      return create(res,category, description);
    }
  },

  getAll(req, res) {

    redisclient().get("cat", async (err, jobs) => {
      if (err) throw err;

      if (jobs) {

          res.status(200).send({
              jobs: JSON.parse(jobs),
              message: "data retrieved from the cache"
          });

      }else {

       return getAll(res)

      }

    });


  },

  getSingleCategory(req, res) {
    let { id } = req.params;

    return getSingleCategory(res,id)
  },

  update(req, res) {
    let { id } = req.params;
    let { category, description } = req.body;
    return udpate(res, category, description,id)
  },

  remove(req, res) {
    let { id } = req.params;
   return remove(res,id)
  },

};
