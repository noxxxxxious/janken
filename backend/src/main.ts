import 'dotenv/config'
import path from 'path'
import { app, httpServer, io } from './server.js'
import initSocketServer from './socketEvents/index.js'
import createUser from "./database/functions/user/createUser.js"

const __dirname = path.resolve(path.dirname(''))

if(!process.env.EXPRESS_PORT) throw new Error("Unable to determine process.env.EXPRESS_PORT")

app.post('/rpsapi/user/create', (req, res) => {
    createUser(req.body).then(result => {
        res.json(result)
    })
})

app.get('/', (_req, res) => {
    res.sendFile(__dirname + '/out/public/index.html')
})

initSocketServer(io)

httpServer.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Express running on port ${process.env.EXPRESS_PORT}.`)
    console.log(`MongoDB connection URL: ${process.env.MONGODB_URL}`)
})
