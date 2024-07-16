const express = require('express')

const router = express.Router()

const {checkSchema} = require('express-validator')

const schemaChecker = require('../middlewares/validators/schemaValidator')


const {registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors} = require('../controllers/userController')



router.post('/register',checkSchema(schemaChecker), registerUser)
router.post('/login', loginUser)
router.get('/:id', getUser)
router.get('/', getAuthors)
router.post('/change-avatar', changeAvatar)
router.patch('/edit-user', editUser)




module.exports = router