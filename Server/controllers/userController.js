

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const jwt = require('jsonwebtoken')

const {validationResult} = require('express-validator')

const HttpError = require('../models/errorModel')

const bcrypt = require('bcryptjs')
const { name } = require('../middlewares/validators/schemaValidator')



//catch thrown exceptions
process.on('uncaughtException', (error)=>{
    console.log(`uncaught exception: ${error}`)
    process.exit(1)
})



/**********************************register a new user */

//Post : api/users/register
//unprotected

const registerUser = async (req,res,next) =>{

    try{
       //validationResult(req) is used to store validation errors found

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }


    
        const {name,email,password, confirmPassword} = req.body


        //check if email exists in the database

        const emailExists = await prisma.user.findUnique({
            where: {email: email}
        })

        //if emailExists is true return the error

        if (emailExists) {
            return next(new HttpError("email already exists.", 422))
        }


      //checking if confirm password matches with password

       if(password !== confirmPassword.trim()) {
           return next(new HttpError("passwords do not match.", 422))
       }



       //bcrpt password ~ bcrypt.genSalt(10) is ana algorithm that generates salt
       const salt = await bcrypt.genSalt(10)

       //hash the salt with password

       const hashedPass = await bcrypt.hash(password, salt)
       
        
         
       //populate user details to database
        const response = await prisma.user.create({data: {name,email,password: hashedPass}})

        res.json(`new user ${response.email} registered`)
    }catch(error){
       return next(new HttpError('registration failed', 422))
      
    }

    
}


/**********************************login a user */

//Post : api/users/login
//unprotected

const loginUser = async (req,res, next) =>{
    //res.json({message: 'login successfull'})
    try{
        const {email, password} = req.body
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        
      //check if user  exists using email...if doesn't exist return false credentials....then check if password matches with bcrypt one


        const user = await prisma.user.findUnique({
            where: {email: email},

            // Optionally include other fields you want to retrieve
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              // Add other fields as needed
      },
        })


        if (!user) {
            return next(new HttpError('invalid credentials', 422))
        }


        //match password using bcrypt.compare password entered by user and password in database

        const comparePass = await bcrypt.compare(password, user.password)

        if (!comparePass) {
            return next(new HttpError('invalid credentials', 422))
        }


        const {id, name} = user

        //assign session using JWT 

        const token = jwt.sign({id, name}, process.env.JWT_SECRET, {expiresIn: '1d'})


        res.status(200).json({token, id, name})

    }catch(error){
        return next(new HttpError('login failed. Please check your credentials', 422))
    }
    
}



/**********************************user profile ***********************************/

//get : api/users/userProfile
//protected

const getUser = async (req,res, next) =>{
   try{
   

    const parseId = req.ParseId

      //search a user by id and retrieve the user data

     const user = await prisma.user.findUnique({
        where: {id: parseId},

        select: {
            password: false,
            name: true, 
            email: true,
            avatar: true, 
            posts: true,
        }
     })
     

    //if user does not exist return user not found error

     if (!user) {
    
        return next(new HttpError('user not found', 404))
     }



     res.json({data:user})

     
   }catch(error){
    return next(new HttpError(error))
   }


}


/********************************** change user avatar */

//Post : api/users/change-avatar
//protected

const changeAvatar = (req,res) =>{


    //get user details set in the jwt cookie

    //finish up on changing profile avatar

    const activeUser = req.user

    res.json({status: activeUser})

    

    res.send({activeUser})
    try {


        
    } catch (error) {
        
    }

}


/********************************** edit user details */

//Post : api/users/edit-user
//protected

const editUser = async (req,res, next) =>{

    //edit user
    //res.json({message: 'welcome you are authorized....edit user details'})

    const activeUser = req.user

   //get the sent patched data from req object



   //get user id from jwt token
   const {id} = activeUser

   const {name, email, password, newPassword, confirmPassword} = req.body


   //fetch authorized user data from database
   const user = await prisma.user.findUnique({
    where: {
        id: id
    },
    select: {
        password: true,
        name: true, 
        email: true,
        avatar: true, 
        posts: true,  
    }
   })


   //check if email exist

   const emailExist = await prisma.user.findUnique({
       where: {email: email},
       select: {
        id: true,
        password: false
       }
   })


   //make sure we don't change someone else email
   if (emailExist && emailExist.id != id) {
       next(new HttpError('Email already exist'))
   }
   
  
   //compare current password to db.password
 
   const comparePass = await bcrypt.compare(password, user.password)


   if (!comparePass) {
       return next(new HttpError("invaild current password", 422))

   }


   //match new password and db.password...if true throw error new password matches old password

   const compareNewPass = await bcrypt.compare(newPassword, user.password)

   if (compareNewPass) {
       return(new HttpError("new password matches old password", 422))
   }


   //match newPassword and confirmPassword

   if (newPassword !== confirmPassword) {
       return next(new HttpError("passwords do not match", 422))
   }


   //hash our new password

   const salt = await bcrypt.genSalt(10)

   const newHashPassword = await bcrypt.hash(newPassword, salt)


   //patch data to our database

    const editUser = await prisma.user.update({
        where: {
            id: id 
        },
        data: {
            name: name,
            email: email,
            password: newHashPassword
        }
    })


    res.json({status: 'ok', data: editUser})

}


/********************************** get all authors */

//get : api/users/authors
//unprotected

const getAuthors = async (req,res,next) =>{
   

    try {
        const authors = await prisma.user.findMany({
            select: {
                password: false,
                name: true, 
                email: true,
                avatar: true, 
                posts: true, 
            }
        })

        res.json({users: authors})
        
    } catch (error) {
       return next(new HttpError(error)) 
    }


}



module.exports = {registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors}


