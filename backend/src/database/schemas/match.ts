import { Schema } from "mongoose"

const matchSchema = new Schema({
    participants: Array,
    winner: Number,
    gameCompleted: Boolean,
    rounds: [{
        winner: Number,
        player0Move: Number,
        player1Move: Number
    }]
})

export default matchSchema