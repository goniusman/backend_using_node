const router = require("express").Router();
const authenticate = require("../../../authenticate");
const { create, getAll, remove, update } = require("../controllers/commentController");
// const authenticate = require('../authenmurmur')


router.post("/", authenticate, create);

router.get("/:id",  getAll);

router.delete("/:cid/:pid", authenticate, remove);

router.put("/:id", authenticate, update);

module.exports = router;
