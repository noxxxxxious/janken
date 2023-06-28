import { Socket } from "socket.io"
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'


//Search data shape
interface SearchingPlayer {
    name: String,
    socket: Socket
}

//Store players searching for a match here
const searchingPlayers: SearchingPlayer[] = []

//Try to match players every x amount of seconds
const timeBetweenMatchingsInSeconds = 10

setInterval(() => {
    console.log('Attempting to match players...')
    console.log(`Currently searching players: ${searchingPlayers.map(player => player.name)}`)
    const shuffledSearchingPlayers = _.shuffle(searchingPlayers)
    let bufferPlayer: SearchingPlayer | null
    shuffledSearchingPlayers.forEach(player => {
        if(!bufferPlayer) {
            bufferPlayer = player
        } else {
            const matchId = uuidv4()
            console.log(`Match created: ${bufferPlayer.name} vs ${player.name} | match ${matchId}`)
            stopSearchingForGame(bufferPlayer.socket)
            stopSearchingForGame(player.socket)
            bufferPlayer = null
        }
    })
}, timeBetweenMatchingsInSeconds * 1000)

//Add all matchmaking events to socket
function registerMatchmakingEvents(socket: Socket) {
    searchForGame(socket)
}

//Add player to search array
function searchForGame(socket: Socket) {
    socket.on('searchForGame', playerName => {
        if(searchingPlayers.find(player => player.name == playerName)) {
            console.log(`${playerName} already searching for game`)
            return
        }
        searchingPlayers.push({ name: playerName, socket })
        console.log(`Added ${playerName} with socket id ${socket.id} to matchmaking list.`)
    })
}

//Find player in array and remove
function stopSearchingForGame(socket: Socket) {
    const removedPlayer = _.remove(searchingPlayers, player => player.socket === socket)[0]
    console.log(`Removed player ${removedPlayer.name} from matchmaking search.`)
}

//Hook called when player disconnects
function handleDisconnect(socket: Socket) {
    stopSearchingForGame(socket)
}

export default {
    registerMatchmakingEvents,
    handleDisconnect
}