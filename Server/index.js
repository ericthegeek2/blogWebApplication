const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const upload = require('./uploads/file-upload')

const userRoute = require('./routes/userRoute')
const postRoute = require('./routes/postRoute')
const {notFound,errorHandler} = require('./middlewares/errorWares/errorMiddlewares')



const app = express()

app.use(express.json())

app.use(express.urlencoded({extended: true}))


app.use(cors({credentials: true, origin: 'http://localhost:'}))

const port = 3001

app.post('/upload', upload.single('file'), (req,res) =>{
    if (!req.file) {
        return res.send('post thumbnail not uploaded!, please attach jpeg file under 2 mb')
  
    }

   // req.thumbnail = req.file


    //successfully completion 

    res.status(201).send("post thumbnail uploaded successfully")

    const {name, age} = req.body

    console.log(name, age)
})

app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)

app.get('/api/hello', (req,res)=>{
    
    console.log(req.body)

})

app.use(notFound)


app.use(errorHandler)




app.listen(port, () => console.log(`Example app listening on port ${port}!`))


