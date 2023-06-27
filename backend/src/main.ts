import 'dotenv/config'
import { createServer } from 'http'
import express from "express"
import { Server } from 'socket.io'
import path from 'path'


import createUser from "./database/functions/user/createUser.js"

const __dirname = path.resolve(path.dirname(''))

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.static('public'))
app.use(express.json())

if(!process.env.EXPRESS_PORT) throw new Error("Unable to determine process.env.EXPRESS_PORT")

app.post('/rpsapi/user/create', (req, res) => {
    createUser(req.body).then(result => {
        res.json(result)
    })
})

app.get('/', (_req, res) => {
    res.sendFile(__dirname + '/out/public/index.html')
})

io.on('connection', (socket) => {
    console.log('user connected')
})

httpServer.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Express running on port ${process.env.EXPRESS_PORT}.`)
    console.log(`MongoDB connection URL: ${process.env.MONGODB_URL}`)
})