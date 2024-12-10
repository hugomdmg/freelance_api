import { Router } from 'express'
import { hash } from 'bcrypt'
import Data_base from '../services/data_base.js'

const router = Router()
const db = new Data_base()


router.get('/users', async (req, res) => {
    res.send(await db.getAllItems('users'))
})


router.post('/users/register', async (req, res) => {
    res.send(await db.addItem('users', req.body))
})


export default router