import { createServer } from 'http'
import express from "express"
import { Server } from 'socket.io'
import path from 'path'


import createUser from "./database/functions/user/createUser.js"
import initSocketServer from './socketEvents/index.js'

import 'dotenv/config'
const __dirname = path.resolve(path.dirname(''))

export const app = express()
export const httpServer = createServer(app)
export const io = new Server(httpServer)

app.use(express.static('public'))

