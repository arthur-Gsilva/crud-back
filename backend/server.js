import { PrismaClient } from '@prisma/client'
import express, { urlencoded } from 'express';
import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';

const prisma = new PrismaClient()


const app = express()
app.use(helmet());
app.use(cors());
app.use(express.json())
app.use(urlencoded({ extended: true }));

app.post('/usuarios', async (req, res) => {
    try {
        const { email, name } = req.body

        if (email === '' || name === '') {
            return res.status(400).json({ error: 'Email e nome são obrigatórios' })
        }

        const newUser = await prisma.user.create({
            data: {
                email: email,
                name: name
            }
        })

        res.status(201).json(newUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Ocorreu um erro ao criar o usuário' })
    }
})

app.get('/usuarios', async (req, res) => {
    const users = await prisma.user.findMany()

    res.status(200).json(users)
})

app.put('/usuarios/:id', async (req, res) => {
    try {
        await prisma.user.update({
            where: {id: req.params.id},
            data: {
                name: req.body.name,
                email: req.body.email,
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Ocorreu um erro ao editar o usuário' })
    }
})
app.delete('/usuarios/:id', async (req, res) => {
    try {
        await prisma.user.update({ where: {id: req.params.id}, })
        res.status(200).json({ msg: "excluído com sucesso" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Ocorreu um erro ao deletar o usuário' })
    }
})

app.listen(process.env.PORT || 3000)