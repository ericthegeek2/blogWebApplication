

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const {validationResult} = require('express-validator')

process.on('uncaughtException', (error)=>{
    console.log(`uncaught exception: ${error}`)
    process.exit(1)
})



/**********************************register a new user */

//Post : api/users/register
//unprotected

const registerUser = async (req,res) =>{

    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        const {name,email,password} = req.body
       
        
    
        const response = await prisma.user.create({data: {name,email,password}})
        res.json({response})
    }catch(error){
       error.throw
    }

    
}


/**********************************login a user */

//Post : api/users/login
//unprotected

const loginUser = (req,res) =>{
    res.json({message: 'login successfull'})
}



/**********************************user profile */

//Post : api/users/userProfile
//protected

const getUser = (req,res) =>{
    res.json({message: 'user profile'})
}


/********************************** change user avatar */

//Post : api/users/change-avatar
//protected

const changeAvatar = (req,res) =>{
    res.json({message: 'user avatar'})
}


/********************************** edit user details */

//Post : api/users/edit-user
//protected

const editUser = (req,res) =>{
    res.json({message: 'edit user details'})

}


/********************************** get all authors */

//Post : api/users/authors
//unprotected

const getAuthors = (req,res) =>{
    res.json({message: 'get all authors'})

}



module.exports = {registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors}


