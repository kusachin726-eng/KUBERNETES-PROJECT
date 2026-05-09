const { Server } = require("socket.io");

let io;
const activeSessions = new Map(); // userId -> socketId

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // replace with your frontend URL in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("identify", (userId) => {
      activeSessions.set(userId, socket.id);
      socket.userId = userId;
    });

    socket.on("disconnect", () => {
      if (socket.userId) activeSessions.delete(socket.userId);
      console.log("Client disconnected:", socket.id);
    });
  });
}

function forceLogout(userId) {
  const socketId = activeSessions.get(userId);
  if (!socketId) return;

  const socket = io.sockets.sockets.get(socketId);
  if (socket) {
    socket.emit("forceLogout");
    socket.disconnect(true);
  }

  activeSessions.delete(userId);
}

module.exports = { initSocket, forceLogout };