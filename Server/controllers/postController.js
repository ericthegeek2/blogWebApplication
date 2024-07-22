const HttpError = require('../models/errorModel')

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const path = require('path')
const fs = require('fs')
const {v4: uuid} = require('uuid')

//======================create a post
// post: api/post
//protected

const createPost = async (req,res,next) =>{

    try{
    //res.json('create post')

    const {title,category,description} = req.body

    

    console.log(title,category,description)

    if ( !title || !category || !description) {
        return next(new HttpError('please fill all post fields', 422))
    }

    console.log(req.file)

    /*
    {
  fieldname: 'file',
  originalname: 'blogHomeBackground.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'C:\\Users\\hp\\Desktop\\BlogApp\\webApp\\Server\\uploads\\uploads',
  filename: '1721658487850-blogHomeBackground.jpg',
  path: 'C:\\Users\\hp\\Desktop\\BlogApp\\webApp\\Server\\uploads\\uploads\\1721658487850-blogHomeBackground.jpg',
  size: 45586
}
    
    */

    const {fieldname, originalname, encoding, mimetype, destination, filename, path, size} = req.file

           //add post to database
           
    
            const newPost = await prisma.post.create({
                data: {title,category,description, image: path, userId: req.user.id}
            })

            if (!newPost) {
                return next(new HttpError('post coudn\'t be created', 422))
            }

            //find user and increase post count by 1

            const currentUser = await prisma.user.findUnique({
                where: {id: req.user.id},
                select: {
                    posts: true
                }
            })
           //increment post count

            const userPostCount = currentUser.posts + 1

            await prisma.user.update({
                where: {id: req.user.id},

                data: {
                   posts: userPostCount 
                }
            })

            res.status(201).json({data: newPost})
    }catch(err){
       next(new HttpError(err))
    }

    
}


//=======================get all posts
// get: api/post
//unprotected

const getAllPosts = async (req,res,next) =>{
    res.json('get all posts')
}


//=======================get single post
// post: api/post/:id
//unprotected

const getPost = async (req,res,next) =>{
    res.json('get single post')
}


//=======================get post by category
// get: api/post/categories/:category
//unprotected

const getPostsByCategory = async (req,res,next) =>{
    res.json('get post by category')
}


//=======================get author post
// get: api/post/users/:id
//unprotected

const getUserPosts = async (req,res,next) =>{
    res.json('get author post')
}



//=======================Edit post
// patch: api/posts/:id
//protected

const editPost = async (req,res,next) =>{
    res.json('edit post')
}



//=======================delete post
// delete: api/posts/:id
//unprotected

const deletePost = async (req,res,next) =>{
    res.json('delete post')
}


module.exports = {createPost,getAllPosts,getPost,getPostsByCategory,getUserPosts,editPost,deletePost}