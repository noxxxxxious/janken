import { io } from '../../server.js'
import { v4 as uuidv4 } from 'uuid'
import { 
    Round, 
    PlayerInstance,
    GameMove
} from './types.js'

//Store current matches here
const currentMatches: Match[] = []

//Match class
class Match {
    matchId = uuidv4()
    players: PlayerInstance[]
    winner: PlayerInstance | null = null
    score = { player0: 0, player1: 0}
    //Hard code this for now. 
    //Best of required wins can be found with Math.round(this.bestOf / 2)
    bestOf = 5
    rounds: Round[] = [{
        winner: null,
        player0Move: null,
        player1Move: null
    }]
    
    constructor(players: PlayerInstance[]){
        console.log(`Match created: ${players[0].name} vs ${players[1].name} | match ${this.matchId}`)
        this.players = players

        //Add players to socket room for match
        players.forEach(player => {
            player.socket.join(`match/${this.matchId}`)
        })

        io.in(`match/${this.matchId}`).emit("start match", JSON.stringify({
            matchId: this.matchId,
            players: players.map(player => player.name)
        }))
    }

    //Getters
    getMatchId()            { return this.matchId }
    getPlayers()            { return this.players }
    getWinner()             { return this.winner }
    getRound(index: number) { return this.rounds[index] }
    getLastRound() {
        if (this.rounds.length > 0) {
            return this.rounds[this.rounds.length - 1]
        }
        return null
    }

    addMove(player: PlayerInstance, move: GameMove) {
        const currentRound = this.getLastRound()
        if(!currentRound) throw new Error(`Unable to get most recent round for match ${this.matchId} when trying to add move for player ${player.name}. currentRound: ${currentRound}`)

        const playerIndex = this.players.indexOf(player)
        let currentMove = currentRound[`player${playerIndex}Move` as keyof Round] as GameMove | null

        if(!currentMove) {
            currentMove = move
            this.checkRoundEnd()
        } else {
            console.log(`Player ${player.name} tried to play a move but has already played one this round. MatchId: ${this.matchId} Socket: ${player.socket} Round: ${this.rounds.length}`)
        }
    }

    checkRoundEnd(){
        const currentRound = this.getLastRound()
        if(!currentRound) throw new Error(`Unable to get most recent round for match ${this.matchId} when checking if round had ended. currentRound: ${currentRound}`)

        //If someone hasn't played a move yet, return null to indicate no winner has been announced
        const { player0Move, player1Move } = currentRound
        if(!player0Move || !player1Move) return null

        //Check for tie
        if(player0Move === player1Move) {
            currentRound.winner = "tie"
        }else {
            //Check for win
            if(player0Move == GameMove.Rock) {
                if(player1Move == GameMove.Scissors) {
                    currentRound.winner = this.players[0]
                    this.score.player0++
                } else {
                    currentRound.winner = this.players[1]
                    this.score.player1++
                }
            } else if(player0Move == GameMove.Paper) {
                if(player1Move == GameMove.Rock) {
                    currentRound.winner = this.players[0]
                    this.score.player0++
                } else {
                    currentRound.winner = this.players[1]
                    this.score.player1++
                }
            } else {
                if(player1Move == GameMove.Paper) {
                    currentRound.winner = this.players[0]
                    this.score.player0++
                } else {
                    currentRound.winner = this.players[1]
                    this.score.player1++
                }
            }
        }

        //Check game end
        //TODO

        //Create next round
        this.createNewRound()

        return currentRound.winner
    }

    createNewRound() {
        this.rounds.push({
            winner: null,
            player0Move: null,
            player1Move: null
        })
    }
}

io.on('match/playmove', (matchId, playerName, move) => {
    const match = currentMatches.find(match => match.matchId === matchId)
})

//Get number of ongoing matches
function getNumberOfCurrentMatches(): number {
    return currentMatches.length
}

//Add new match
export function createMatch(players: PlayerInstance[]) {
    const match = new Match(players)
    currentMatches.push(match)
}