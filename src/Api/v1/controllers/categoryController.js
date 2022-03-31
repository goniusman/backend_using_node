// const { findById } = require('../model/cat')
const redisclient = require("../utils/cache");
const Category = require("../models/Category");
const { serverError, resourceError } = require("../utils/error");
const categoryValidator = require("../validator/categoryValidator");

const { create, getAll, remove, update, getSingleCategory } = require('../services/categoryServices')


module.exports = {

  async create(req, res) {
    let { category, description } = req.body;

    let validate = categoryValidator({ category });

    if (!validate.isValid) {
      return res.status(400).json(validate.error);
    } else {
      return await create(res,category, description);
    }
  },
 
  getAll(req, res) {

    redisclient().get("cat", async (err, jobs) => {
      if (err) throw err;

      if (jobs) {

        return res.json({ 
          cat: JSON.parse(jobs),
          message: "data retrieved from the cache",
          success: true
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

  async update(req, res) {
    let { id } = req.params;
    let { category, description } = req.body;
    return await update(res, category, description,id)
  },

  remove(req, res) {
    let { id } = req.params;
   return remove(res,id)
  },

};
