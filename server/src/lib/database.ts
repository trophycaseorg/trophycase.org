import Database from "better-sqlite3"
import path from "node:path"
import type { PSNGame } from "./types/psn.ts"

const db = new Database(path.resolve("db/database.db"))

export function addPSNGame(game: PSNGame) {
    try {
        db.prepare("INSERT INTO psnGames (appid, name, boxArtURL, platform, trophies) VALUES (?, ?, ?, ?, ?)")
            .run(
                game.npCommunicationId,
                game.name,
                game.boxArt,
                game.platform,
                JSON.stringify(game.trophies)
            )
    } catch (error) {
        console.error("error adding PSN game: " + error)
        return
    }
}

export function getPSNGame(npCommunicationId: string): PSNGame | undefined {
    try {
        const row = db.prepare("SELECT * FROM psnGames WHERE appid = ?").get(npCommunicationId) as any
        const psnGame: PSNGame = {
            name: row.name,
            boxArt: row.boxArtURL,
            platform: row.platform,
            trophies: row.trophies,
            progress: undefined,
            npCommunicationId: npCommunicationId
        }

        return psnGame
    } catch (error) {
        return undefined
    }
}