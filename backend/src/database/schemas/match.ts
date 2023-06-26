import mongoose from "mongoose"

const matchSchema = new mongoose.Schema({
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