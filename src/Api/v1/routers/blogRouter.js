const router = require("express").Router({mergeParams: true});

const authenticate = require("../../../authenticate");
const {parseData} = require("../utils/commonUtility");
// const { isAuth } = require("../middlewares/auth");
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
} = require("../controllers/blogController");

router.post("/", authenticate, create); 
// router.post("/", authenticate, parseData, create); 
router.get("/",  getAll); 
router.get('/:id', authenticate, getSinglePost);
router.get('/category/:category/:qty?', getPostByCategory);
router.put("/:id", authenticate, update);
router.post("/search/:query",  searchQuery);
router.put("/toggle/:id", authenticate, toogleUpdate);
router.delete("/:id", remove);
router.post('/upload/:id', authenticate, imageUpload)

// router.put('/issuetoggle/:id', updateSolved)

module.exports = router;
