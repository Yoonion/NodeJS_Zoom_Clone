import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const server = http.createServer(app); // http server
const io = SocketIO(server);

io.on("connection", (socket) => {

  socket["nickname"] = "Anon";

  socket.on("enter_room", (roomName, done) => {
    socket.join((roomName));
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname);
    });
  });

  socket.on("new_msg", (msg, room, done) => {
    socket.to(room).emit("new_msg", `${socket.nickname} : ${msg}`);
    done();
  });

  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));

});

server.listen(3000);
