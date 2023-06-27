import { Server } from "socket.io"

function initSocketServer(io: Server) {
    

    io.on('connection', (socket) => {
        console.log(`User connected [${socket.id}]`)
        socket.emit('stestevent', {abc: "twe"})
        socket.on('testevent', (arg) => {
            console.log('received testevent.' + arg + 'sending stestevent')
            io.emit('stestevent', {abc: "twe"})
        })
    })
}

export default initSocketServer