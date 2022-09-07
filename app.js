const express = require("express");
const path = require("path");
const app = express();
const port = 8888;
const { Server } = require("socket.io");
const http = require("http").createServer(app);

app
  .use("/app", (req, res, next) => {
    console.log(req.ip);
    next();
  })
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
        player.emit("numberChanged", players.length);
        if (player.pseudo != socket.pseudo) {
          player.emit(
            "msg-received",
            socket.pseudo + " vient de se connecter au chat !"
          );
        } else {
          player.emit("msg-received", "Bienvenue sur le chat !");
        }
      });
      socket.emit("numberChanged", players.length);
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
  socket.on("disconnect", () => {
    if (socket.pseudo != undefined) {
      players.pop(socket);
      players.forEach((player) => {
        player.emit(
          "msg-received",
          socket.pseudo + " vient de se déconnecter du chat !"
        );
      });
    }

    players.forEach((player) => {
      player.emit("numberChanged", players.length);
    });

    console.log("Nb de gens en ligne :", players.length);
  });
});
