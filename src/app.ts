import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import authRouter from "./routes/authRoutes";
import attackRouter from "./routes/attackRoutes";
import defenseRouter from "./routes/defenseRoutes";

import { Server } from "socket.io";
import { handleSocketConnection } from "./sockets/io";
import { connectToMongo, runInitialSetup } from "./config/db";

const PORT = process.env.PORT || 3000;

const app = express();
const httpServer = http.createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

io.on("connection", handleSocketConnection);

connectToMongo().then(() => {
  // Run initial setup only if needed
  runInitialSetup();
});

app.use(express.json());
app.use(cors());

app.use("/api/auth",authRouter)
app.use("/api/attack", attackRouter);
app.use("/api/defense", defenseRouter);
httpServer.listen(PORT, () => {
  console.log(`Server started, Visit "http://localhost:${PORT}"`);
});