const express = require('express')
const app = express()

const port = process.env.port || 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('hello world')
})


app.listen(port, () => { console.log(`Server: http://localhost:${port}`) })