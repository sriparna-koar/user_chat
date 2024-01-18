
const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
app.use(cors()); 

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://127.0.0.1:5500", 
      methods: ["GET", "POST"],
    },
  });

const users = {};
io.on("connection", (socket) => {
  socket.on("new-user-joined", (name1) => {

    users[socket.id] = name1;
    socket.broadcast.emit("user-joined", name1);
  });
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name1: users[socket.id],
    });
  });
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", 

      users[socket.id]
    );
    delete users[socket.id];
  });
});


server.listen(8000, () => {
    console.log("Server started on port 8000");
  });
