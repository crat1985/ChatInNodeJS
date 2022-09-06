const express = require("express");
const path = require("path");
const app = express();
const port = 8888;
const { Server } = require("socket.io");
const http = require("http").createServer(app);

app
  .use(
    "/bootstrap/css",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
  )
  .use(
    "/bootstrap/js",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
  )
  .use(
    "/jquery",
    express.static(path.join(__dirname, "node_modules/jquery/dist"))
  )
  .use(express.static("public"));

require("./src/routes/routes")(app);

const io = new Server(http);

let players = [];

http.listen(port, () => {
  console.log(`Listening on http://90.125.35.111:${port}/`);
});

io.on("connection", (socket) => {
  console.log("New connection !", socket.id);

  socket.on("pseudo", (pseudo) => {
    if (pseudo.length >= 5) {
      players.push(socket);
      console.log("Nb de gens en ligne :", players.length);
      socket.pseudo = pseudo;
      socket.emit("pseudoOk");
      players.forEach((player) => {
        console.log("DEBUG - " + player.pseudo, socket.pseudo);
        if (player.pseudo != socket.pseudo) {
          player.emit(
            "msg-received",
            socket.pseudo + " vient de se connecter au chat !"
          );
        }
      });
      socket.on("msg-sent", (msg) => {
        players.forEach((player) => {
          if (player.pseudo == socket.pseudo) {
            socket.emit("msg-received", "Toi : " + msg);
          } else {
            player.emit("msg-received", socket.pseudo + " : " + msg);
          }
        });
      });
    } else {
      socket.pseudo = undefined;
    }
  });
  socket.on("disconnect", (socket) => {
    players.forEach((player) => {
      if (player.pseudo != socket.pseudo && socket.pseudo != undefined) {
        player.emit(
          "msg-received",
          socket.pseudo + " vient de se déconnecter du chat !"
        );
      }
    });
    players.pop(socket.pseudo);
    console.log("Nb de gens en ligne :", players.length);
  });
});
