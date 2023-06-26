import { Schema } from "mongoose"

const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    battlePass: {
        level: Number,
        experience: Number
    },
    ownedGoods: {
        skins: [{
            name: String,
            variants: [{name: String, unlockedTime: Date}]
        }],
        animations: {
            idle: [{name: String, unlockedTime: Date}],
            intro: [{name: String, unlockedTime: Date}],
            victory: [{name: String, unlockedTime: Date}],
            defeat: [{name: String, unlockedTime: Date}],
            rock: [{name: String, unlockedTime: Date}],
            paper: [{name: String, unlockedTime: Date}],
            scissors: [{name: String, unlockedTime: Date}]
        },
        nameplates: [{name: String, unlockedTime: Date}],
        rings: [{name: String, unlockedTime: Date}],
        charms: [{name: String, unlockedTime: Date}],
        titles: [{name: String, unlockedTime: Date}]
    },
    currentlySelectedGoods: {
        skin: {
            name: String,
            variant: {name: String, unlockedTime: Date}
        },
        animations: {
            idle: String,
            intro: String,
            victory: String,
            defeat: String,
            rock: String,
            paper: String,
            scissors: String
        },
        nameplates: String,
        rings: String,
        charms: String,
        titles: String
    },
    gamesWon: Number,
    gamesPlayed: Number,
    moveCounters: {
        rock: Number,
        paper: Number,
        scissors: Number
    },
    matchHistory: Array
})

export default userSchema