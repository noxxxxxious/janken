import { createServer } from 'http'
import express from "express"
import { Server } from 'socket.io'


import initSocketServer from './socketEvents/index.js'

import 'dotenv/config'

export const app = express()
export const httpServer = createServer(app)
export const io = new Server(httpServer)

app.use(express.static('public'))

