const express = require('express')

const checkAuthorization = require('../middlewares/AuthMiddlewares/auth')

const upload = require('../uploads/file-upload')

const{createPost,getAllPosts,getPost,getPostsByCategory,getUserPosts,editPost,deletePost} = require('../controllers/postController')




const router = express.Router()

router.post('/', upload.single('file'),checkAuthorization, createPost)
router.get('/', getAllPosts)
router.get('/:id', getPost)
router.get('/categories/:category', getPostsByCategory)
router.get('/users/:id', getUserPosts)
router.patch('/:id', checkAuthorization, editPost)
router.delete('/:id', checkAuthorization, deletePost)

module.exports = router