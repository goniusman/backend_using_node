const router = require('express').Router()
const { create, getAll, remove, update, getSingleCategory } = require('../controllers/categoryController')
// const authenticate = require('../authenticket')

router.post('/', create)

router.get('/', getAll)

router.get('/:id', getSingleCategory)

router.put('/:id', update)

router.delete('/:id', remove)

module.exports = router