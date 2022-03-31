const router = require('express').Router()
const { create, getAll, remove, update, getSingleCategory } = require('../controllers/categoryController')
const authenticate = require("../../../authenticate");

router.post('/', authenticate, create)
 
router.get('/', authenticate, getAll)

router.get('/:id', authenticate, getSingleCategory)

router.put('/:id', authenticate, update)

router.delete('/:id', authenticate, remove)

module.exports = router