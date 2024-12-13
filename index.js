import express, { urlencoded, json } from 'express'
import users from './src/routes/users.js'
import cors from 'cors'

const app = express()
const port = process.env.port || 3001

app.use(urlencoded({ extended: false }))
app.use(json())
app.use(cors());

app.use(users)


app.get('/', (req, res)=>{
    res.send('hello world, this is Hugo freelance api')
})



app.listen(port, () => { console.log(`Server: http://localhost:${port}`) })