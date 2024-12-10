import express, { urlencoded, json } from 'express'
const app = express()

import users from '../API/users.js'
import mongo from '../API/mongo.js'



const port = process.env.port || 3001

app.use(urlencoded({ extended: false }))
app.use(json())
app.use(users)
app.use(mongo)

app.get('/', (req, res)=>{
    res.send('hello world')
})

app.post('/login', (req, res)=>{


    res.send({})
})


app.listen(port, () => { console.log(`Server: http://localhost:${port}`) })