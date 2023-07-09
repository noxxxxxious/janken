import { Socket } from "socket.io"
import { io } from '../../server.js'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'


//Search data shape
interface PlayerInstance {
    name: String,
    socket: Socket
}

//Store players searching for a match here
const searchingPlayers: PlayerInstance[] = []

//Try to match players every x amount of seconds
const timeBetweenMatchingsInSeconds = 10

//Ongoing match data shape
interface OngoingMatch {
    matchId: string,
    participants: PlayerInstance[],
    winner: PlayerInstance | null,
    rounds: Round[]
}

interface Round {
    winner: PlayerInstance
    player0Move: string,
    player1Move: string,
}

//Store current matches here
const currentMatches: OngoingMatch[] = []

//Match players
setInterval(() => {
    console.log('Attempting to match players...')
    console.log(`Currently searching players: ${searchingPlayers.map(player => player.name)}`)
    //Shuffle players to add randomness to matching
    const shuffledSearchingPlayers = _.shuffle(searchingPlayers)

    let bufferPlayer: PlayerInstance | null
    shuffledSearchingPlayers.forEach(player => {
        //If not matching anyone, get someone to match
        if(!bufferPlayer) {
            bufferPlayer = player
        } else {
            //If matching someone, this current person will be their adversary
            const matchId = uuidv4()
            console.log(`Match created: ${bufferPlayer.name} vs ${player.name} | match ${matchId}`)

            //Remove players from search queue
            stopSearchingForGame(bufferPlayer.socket)
            stopSearchingForGame(player.socket)

            //Create current match
            currentMatches.push({
                matchId,
                participants: [bufferPlayer, player],
                winner: null,
                rounds: []
            })
            //Add players to socket room for match
            bufferPlayer.socket.join(`match/${matchId}`)
            player.socket.join(`match/${matchId}`)

            io.in(`match/${matchId}`).emit("start match", {
                players: [ bufferPlayer.name, player.name ]
            })

            //Clear matching player to start over
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
    if(removedPlayer){
        console.log(`Removed player ${removedPlayer.name} from matchmaking search.`)
    }
}

//Hook called when player disconnects
function handleDisconnect(socket: Socket) {
    stopSearchingForGame(socket)
}

export default {
    registerMatchmakingEvents,
    handleDisconnect
}
