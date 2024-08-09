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

    

    

    if ( !title || !category || !description.length) {
        return next(new HttpError('please fill all post fields', 422))
    }

    

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
                data: {title,category,description, image: filename, userId: req.user.id}
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

            res.status(201).json(newPost)
    }catch(err){
       next(new HttpError(err))
    }

    
}


//=======================get all posts
// get: api/post
//unprotected

const getAllPosts = async (req,res,next) =>{
    //res.json('get all posts')

    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                updatedAt: 'desc'
            }
        })

        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }


}


//=======================get single post
// post: api/post/:id
//unprotected

const getPost = async (req,res,next) =>{
    //res.json('get single post')

    try {
        //getting post id from params
       

        const parseId = req.ParseId

        console.log(parseId)


        const post = await prisma.post.findUnique({
           where: {
            id: parseId
           },
           select: {
            id: true,
            title: true,
            description: true,
            category: true,
            image: true,
            createdAt: true,
            userId: true,
            updatedAt: true
           } 
        })

        if (!post) {
            return next(new HttpError("post not found", 404))
        }

        res.json(post)

    } catch (error) {
        console.log(error)
    }
}


//=======================get post by category
// get: api/post/categories/:category
//unprotected

const getPostsByCategory = async (req,res,next) =>{
    //res.json('get post by category')



    try {
        const {category} = req.params

        const categoryPosts = await prisma.post.findMany({
            where: {
                category: category
            },
            
            select: {
                title: true,
                description: true,
                category: true,
                image: true,
                createdAt: true,
                updatedAt: true 
            },
            orderBy: {
              updatedAt: 'desc'  
            }
        })

        res.json(categoryPosts)

    } 
    catch (error) {
        
        return next(new HttpError(error))
    }


    
}


//=======================get author post
// get: api/post/users/:id
//unprotected

const getUserPosts = async (req,res,next) =>{
   // res.json('get author post')

   try {

    const parseId = req.ParseId

    console.log(parseId)

    const authorPosts = await prisma.post.findMany({
        where: {
            userId: parseId
        },
        select: {
            title: true,
            description: true,
            category: true,
            image: true,
            userId: true,
            createdAt: true,
            updatedAt: true 
        },
        orderBy: {
            updatedAt: 'desc'
        }
    })


    res.json(authorPosts)

   } catch (error) {
      return next(new HttpError(error))
   }
}



//=======================Edit post
// patch: api/posts/:id
//protected

const editPost = async (req,res,next) =>{
    //res.json('edit post')


    try {
        
        const {title,category,description} = req.body

        const parseId = req.ParseId

    
       console.log(title, category, description, req.file)
    

        if ( !title || !category || !description) {
            return next(new HttpError('please fill all post fields', 422))
        }

        

    
    
        
    
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

      const post = await prisma.post.findUnique({
        where: {
            id: parseId
        },
        select: {
           userId: true 
        }
      })
    
        const {fieldname, originalname, encoding, mimetype, destination, filename, path, size} = req.file
        
        
       if(req.user.id === post.userId){
        const newPost = await prisma.post.update({
            where: {
                id: parseId
            },
           data: {
            title: title,
            description: description,
            category: category,
            image: filename
           } 
        })

        res.status(200).json(newPost)

        }else{
            return next(new HttpError('you cannot edit someone else post!!!'))
        }



        if (!newPost) {
            return next(new HttpError("could not update post"))
        }

        

    } catch (error) {
        return next(new HttpError(error))
    }


}



//=======================delete post
// delete: api/posts/:id
//unprotected

const deletePost = async (req,res,next) =>{
   // res.json('delete post')

   const parseId = req.ParseId

   console.log(parseId)



   const post = await prisma.post.findUnique({
    where: {
        id: parseId
    },
    select: {
       userId: true 
    }
  })

  console.log(post)
  
  

   if (req.user.id === post.userId) {
      await prisma.post.delete({

        where: {
            id: parseId 
        }

      })

      //update post count of author

      const user = await prisma.user.findUnique({
        where: {
            id: req.user.id
        },
        select: {
            posts: true
        }
      })


      const updatePostCount = user.posts - 1

      //update post count

      await prisma.user.update({
        where: {
           id: req.user.id 
        },
        data: {
           posts: updatePostCount 
        }
      })

      res.status(200).json({msg: `deleted post ${parseId} successfully of user id ${post.userId}`})
   }else{

    return next(new HttpError('you cannot delete someone else post'))
   }

   
}


module.exports = {createPost,getAllPosts,getPost,getPostsByCategory,getUserPosts,editPost,deletePost}