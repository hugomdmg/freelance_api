import express, { urlencoded, json } from 'express'
import users from './rutes/users.js'

const app = express()
const port = process.env.port || 3001

app.use(urlencoded({ extended: false }))
app.use(json())
app.use(users)


app.get('/', (req, res)=>{
    res.send('hello world, this is Hugo freelance api')
})



app.listen(port, () => { console.log(`Server: http://localhost:${port}`) })