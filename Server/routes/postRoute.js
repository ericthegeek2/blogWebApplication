const express = require('express')

const checkAuthorization = require('../middlewares/AuthMiddlewares/auth')

const upload = require('../uploads/file-upload')

const resolveIndex = require('../middlewares/resolveMiddlewares/resolveParamString')

const{createPost,getAllPosts,getPost,getPostsByCategory,getUserPosts,editPost,deletePost} = require('../controllers/postController')




const router = express.Router()

router.post('/', upload.single('file'),checkAuthorization, createPost)
router.get('/', getAllPosts)
router.get('/:id',resolveIndex, getPost)
router.get('/categories/:category', getPostsByCategory)
router.get('/users/:id', resolveIndex, getUserPosts)
router.patch('/:id', upload.single('file'),resolveIndex, checkAuthorization, editPost)
router.delete('/:id', resolveIndex, checkAuthorization, deletePost)

module.exports = router

