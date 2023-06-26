import express from "express"
require("dotenv").config()

const app = express()

app.use(express.static('public'))
app.use(express.json())

if(!process.env.EXPRESS_PORT) throw new Error("Unable to determine process.env.EXPRESS_PORT")

app.post('/rpsapi/user/create', (req, res) => {
    console.log(req.body)
    res.json(req.body)
})

app.get('/', (_req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Express running on port ${process.env.EXPRESS_PORT}.`)
    console.log(`MongoDB connection URL: ${process.env.MONGODB_URL}`)
})