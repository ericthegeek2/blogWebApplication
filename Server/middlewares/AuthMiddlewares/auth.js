
const HttpError = require('../../models/errorModel')

const jwt = require('jsonwebtoken')


const checkAuthorization = (req,res,next) =>{

    //confirm if req.header contains authorization

  try{

    const Authorization = req.headers.Authorization || req.headers.authorization

    if (Authorization && Authorization.startsWith("Bearer")) {
      const token =Authorization.split(' ')[1]



    //verify the jwt token

    jwt.verify(token, process.env.JWT_SECRET, (err, info) =>{

        //if there is an error ~ send unauthorized. invalid token
      
        if (err) {
            return next(new HttpError("unauthorized. Invalid token", 403))
        }

        //create an object of user and set user info

        req.user = info

        next()
    })
    
   }


    
      

    } catch (error) {
        next(new HttpError('Invalid token', 422))
    }    

    
}

module.exports = checkAuthorization