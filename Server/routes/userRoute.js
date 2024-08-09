const express = require('express')

const upload = require('express-fileupload')
const router = express.Router()

const {checkSchema} = require('express-validator')

const resolveIndex = require('../middlewares/resolveMiddlewares/resolveParamString')

const registerSchemaChecker = require('../middlewares/validators/schemaValidator')
const loginSchemaChecker = require('../middlewares/validators/loginSchemaValidator')

//import the auth middleware

const checkAuthorization = require('../middlewares/AuthMiddlewares/auth')

const upload2 = require('../uploads/file-upload')


const {registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors} = require('../controllers/userController')



router.post('/register',checkSchema(registerSchemaChecker), registerUser)
router.post('/login',checkSchema(loginSchemaChecker), loginUser)
router.get('/:id',resolveIndex, getUser)
router.get('/', getAuthors)
router.post('/change-avatar',upload2.single('file') ,checkAuthorization, changeAvatar)
router.patch('/edit-user',checkAuthorization, editUser)




module.exports = router