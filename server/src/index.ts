import express from "express"
import cors from "cors"
import { psnRouter } from "./routes/psn.ts"

const isNightly = false
const isLocal = true
const WEBSITE_URL = (isLocal) ? "http://localhost:3000" : (isNightly) ? "https://nightly.trophycase.org" : "https://trophycase.org"

const port = 2876
const app = express()

const corsOptions = {
    origin: WEBSITE_URL,
    credentials: true,
}

app.use(express.json())
app.use(cors(corsOptions))

app.use("/psn", psnRouter)

app.get("/", (req, res) => {
    res.send("Server is up.")
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})