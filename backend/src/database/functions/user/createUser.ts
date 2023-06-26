import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from '../../database.js'
import userSchema from '../../schemas/user.js'

interface UserCredentials {
    username: String,
    password: String
}

async function createUser(inData: UserCredentials){
    if(!process.env.PASSWORD_SALT) throw new Error("Unable to determine process.env.PASSWORD_SALT")

    const creationDate = new Date()
    const User = mongoose.model('User', userSchema)
    const saltedHashedPassword = crypto.createHash('sha256').update(inData.password + process.env.PASSWORD_SALT).digest('hex')
    const user = new User({
        username: inData.username,
        password: saltedHashedPassword,
        battlePass: {
            level: 1,
            experience: 0
        },
        ownedGoods: {
            skins: [{
                name: "Default",
                variants: [{name: "Default", unlockedTime: creationDate}]
            }],
            animations: {
                idle: [{name: "Default", unlockedTime: creationDate}],
                intro: [{name: "Default", unlockedTime: creationDate}],
                victory: [{name: "Default", unlockedTime: creationDate}],
                defeat: [{name: "Default", unlockedTime: creationDate}],
                rock: [{name: "Default", unlockedTime: creationDate}],
                paper: [{name: "Default", unlockedTime: creationDate}],
                scissors: [{name: "Default", unlockedTime: creationDate}]
            },
            nameplates: [{name: "Default", unlockedTime: creationDate}],
            rings: [{name: "Default", unlockedTime: creationDate}],
            charms: [{name: "Default", unlockedTime: creationDate}],
            titles: [{name: "Default", unlockedTime: creationDate}]
        },
        currentlySelectedGoods: {
            skin: {
                name: "Default",
                variant: {name: "Default", unlockedTime: creationDate}
            },
            animations: {
                idle: "Default",
                intro: "Default",
                victory: "Default",
                defeat: "Default",
                rock: "Default",
                paper: "Default",
                scissors: "Default"
            },
            nameplates: "Default",
            rings: "Default",
            charms: "Default",
            titles: "Default"
        },
        gamesWon: 0,
        gamesPlayed: 0,
        moveCounters: {
            rock: 0,
            paper: 0,
            scissors: 0
        },
        matchHistory: []
    })

    try{
        const result = await user.save()
        
    }catch(err){
        return {
            error: err,
            result: "There was an error creating the account."
        }
    }
    

    return {
        error: false,
        result: "Account created successfully."
    }
}

export default createUser