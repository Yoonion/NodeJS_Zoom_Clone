import http from "http";
import { Server } from "socket.io";
import express from "express";
import { instrument  } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const server = http.createServer(app); // http server
const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true
  }
});
instrument(io, {
  auth: false
});


function publicRooms() {
  const sids = io.sockets.adapter.sids;
  const rooms = io.sockets.adapter.rooms;

  const publicRooms = [];
  rooms.forEach((_, key) => {
    if( sids.get(key) === undefined ) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

// user count
function countRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on("connection", (socket) => {

  socket["nickname"] = "Anon"; // default nickname

  socket.on("enter_room", (roomName, done) => {
    socket.join((roomName));
    done();
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    io.sockets.emit("room_change", publicRooms()); // message to all connecting sockets
  });

  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms()); // message to all connecting sockets
  });
  
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname, countRoom(room)-1 );
    });
  });

  socket.on("new_msg", (msg, room, done) => {
    socket.to(room).emit("new_msg", `${socket.nickname} : ${msg}`);
    done();
  });

  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));

});

server.listen(3000);
