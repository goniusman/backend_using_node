const router = require("express").Router({mergeParams: true});

const authenticate = require("../../../authenticate");
const {
  create,
  getAll,
  getSinglePost,
  update,
  remove,
  toogleUpdate,
  searchQuery,
} = require("../controllers/postController");

// for authenticate user
// const authenticate = require('../authenticate')




router.post("/", create); 
router.get("/", getAll);
router.get('/:id', getSinglePost);
router.put("/:id", update);
router.post("/search/:query", searchQuery);
router.put("/toggle/:id", toogleUpdate);
router.delete("/:id", remove);

// router.post('/upload/:id', imageUpload)
// router.put('/issuetoggle/:id', updateSolved)

module.exports = router;
