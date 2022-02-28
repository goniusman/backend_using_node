const router = require("express").Router({mergeParams: true});

const authenticate = require("../../../authenticate");
// const { isAuth } = require("../middlewares/auth");
const {
  create,
  getAll,
  getSinglePost,
  update,
  remove,
  toogleUpdate,
  searchQuery,
  imageUpload
} = require("../controllers/blogController");

router.post("/", authenticate, create); 
router.get("/", getAll);
router.get('/:id', getSinglePost);
router.put("/:id", authenticate, update);
router.post("/search/:query",  searchQuery);
router.put("/toggle/:id", authenticate, toogleUpdate);
router.delete("/:id", authenticate, remove);
router.post('/upload/:id', authenticate, imageUpload)
// router.put('/issuetoggle/:id', updateSolved)

module.exports = router;
