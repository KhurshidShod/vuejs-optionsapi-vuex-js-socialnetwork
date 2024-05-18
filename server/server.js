const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
  socket.on("join-room", (data) => {
    socket.join(data);
    console.log(`User ${socket.id} joined to room ${data}`);
  });
  socket.on("message", (data) => {
    console.log(data);
    socket.to(data.room).emit("message:received", data.message);
  });
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} left.`);
  });
});
app.get("/", (req, res) => {
  res.send("<h1>Hello from Railway</h1>");
});
server.listen(PORT, () => {
  console.log("Chat server is running on 3000 port.");
});
