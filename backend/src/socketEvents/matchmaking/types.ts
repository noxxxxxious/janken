import { Socket } from "socket.io"

//Search data shape
export interface PlayerInstance {
    name: String,
    socket: Socket
}

export interface Round {
    winner: PlayerInstance | string | null
    player0Move: GameMove | null,
    player1Move: GameMove | null
}

export enum GameMove {
    Rock = 1,
    Paper,
    Scissors
}
