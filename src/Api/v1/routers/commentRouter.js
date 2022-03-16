const router = require("express").Router();
const authenticate = require("../../../authenticate");
const { create, getAll, remove, update } = require("../controllers/commentController");
// const authenticate = require('../authenticket')

router.post("/", create);

router.get("/:id", getAll);

router.delete("/:id", remove);

router.put("/:id", update);

module.exports = router;
