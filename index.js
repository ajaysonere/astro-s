import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config.js";
import { WebSocketServer } from "ws";
import http from "http";
import userRouter from "./routes/userRoute.js";
import tradeRouter from "./routes/tradeRoute.js";
import adminRoute from "./routes/adminRoute.js";
import HttpError from "./models/errorModel.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import rssRoute from "./routes/rssRoute.js";
import path , {dirname} from "path";
import { fileURLToPath } from "url";


const app = express();

const PORT = process.env.PORT || 4500;
const PASSWORD  = process.env.MONGO_PASSWORD;
const __dirname = dirname(fileURLToPath(import.meta.url));

const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ server });

const MONGO = process.env.MONGO_URL;

// database connection
const connection = async () => {

  const conn = await mongoose.connect(MONGO);

  if (!conn) {
    console.log("Something went wrong");
  }

  console.log("database connected successfully");
};

// WebSocket server logic
webSocketServer.on("connection", (ws) => {
  console.log("WebSocket connection opened");
  ws.on("message", (message) => {
    // Handle messages from clients (if needed)
    console.log(`Received message: ${message}`);
  });
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

(async () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  
  const uploadsPath = path.join(__dirname, "uploads");
  app.use("/uploads", express.static(uploadsPath));

  
  app.get("/", (req, res) => {
    res.send("App is running");
  });

  app.use("/api/users", userRouter);
  app.use("/api/trades", tradeRouter);
  app.use("/api/admin", adminRoute);
  app.use("/api", rssRoute);
  app.use(notFound, errorHandler);
  app.use(HttpError);


  server.listen(PORT, () => {
    connection();
    console.log(`Server is running on port ${PORT}`);
  });
})();
