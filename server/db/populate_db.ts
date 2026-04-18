import axios from "axios"
import Database from "better-sqlite3"

const psnDB = new Database("psn_games.db")

function generateDBSchema() {
    psnDB.prepare("CREATE TABLE IF NOT EXISTS psnGames(appid integer, name text not null, achievements text)")
}