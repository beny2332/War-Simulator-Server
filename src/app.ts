import express from "express"
import "dotenv/config"

import { connectToMongo } from "./config/db"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import { handleSocketConnection } from "./sockets/io"

const PORT = process.env.PORT || 3000

const app = express()
const httpServer = http.createServer(app)
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: "*",
  },
})

io.on("connection", handleSocketConnection)

connectToMongo()

app.use(express.json())
app.use(cors())


httpServer.listen(PORT, () => {
  console.log(`Server started, Visit "http://localhost:${PORT}"`)
})