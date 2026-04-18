import express from "express"
import { psnRouter } from "./routes/psn.ts"

const port = 2876
const app = express()
app.use(express.json())

app.use("/psn", psnRouter)

app.get("/", (req, res) => {
    res.send("Server is up.")
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})