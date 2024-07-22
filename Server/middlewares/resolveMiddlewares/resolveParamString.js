const resolveIndex = (req,res,next)=>{
    
    const {id} = req.params
    const parseId =parseInt(id)

    if (isNaN(parseId)){
        return res.sendStatus(400)
    } 

   req.ParseId = parseId
   
   next()

}

module.exports = resolveIndex
