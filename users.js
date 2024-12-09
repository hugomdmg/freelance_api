import { Router } from 'express'
const router = Router()
import { hash } from 'bcrypt'

const users = []

router.get('/users', (req, res)=>{


    res.send('hello world from users')
})

router.post('/register', async (req, res)=>{
    const {email, password} = req.body
    const existingUser = users.find(u => u.email == email)

    if(existingUser){
        res.send('user already exist')
    }else{
        const hashedpassword = await hash(password, 10)
        users.push({email: email, password:hashedpassword})
        res.send('user register success')

    }

})


export default router