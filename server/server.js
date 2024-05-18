const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
  socket.on('join-room', data => {
    socket.join(data)
    console.log(`User ${socket.id} joined to room ${data}`)
  })
  socket.on('message', (data) => {
    console.log(data)
    socket.to(data.room).emit('message:received', data.message)
  })
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} left.`);
  });
});
server.listen(3000, () => {
  console.log("Chat server is running on 3000 port.");
});
