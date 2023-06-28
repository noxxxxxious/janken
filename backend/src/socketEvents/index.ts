import { Server } from "socket.io"
import matchmaking from './matchmaking/index.js'

function initSocketServer(io: Server) {
    io.on('connection', (socket) => {
        console.log(`User connected [${socket.id}]. Registering events.`)
        matchmaking.registerMatchmakingEvents(socket)
        
        //Disconnect
        socket.on("disconnect", (_reason) => {
            console.log(`Disconnect of socket with id ${socket.id}`)
            matchmaking.handleDisconnect(socket)
        })
    })
}

export default initSocketServer