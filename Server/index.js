const express = require('express')
const cors = require('cors')

const userRoute = require('./routes/userRoute')
const postRoute = require('./routes/postRoute')
const {notFound,errorHandler} = require('./middlewares/errorWares/errorMiddlewares')



const app = express()

app.use(express.json({extended: true}))

app.use(express.urlencoded({extended: true}))

app.use(cors({credentials: true, origin: 'http://localhost:'}))

const port = 3000

app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)

app.use(notFound)
app.use(errorHandler)



app.listen(port, () => console.log(`Example app listening on port ${port}!`))