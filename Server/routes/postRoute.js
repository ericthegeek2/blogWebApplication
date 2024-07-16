const express = require('express')

const router = express.Router()




router.get('/', (req,res) => res.json({status: 'ok', path: 'this is the post route'}))




module.exports = router