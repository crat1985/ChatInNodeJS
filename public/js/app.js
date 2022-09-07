const submit = document.querySelector(".submit");
const morpionDiv = document.querySelector(".morpion");
const form = document.querySelector("form");
const loginInfos = document.querySelector(".loginInfos");
const msgArea = document.querySelector(".msgArea");
const sendMessageBox = document.querySelector(".sendMessageBox");
const pseudoOkP = document.querySelector(".pseudoOk");
const sendMsg = document.querySelector(".sendMsg");
const textEntry = document.querySelector(".textEntry");
const connectedClientsNumber = document.querySelector(
  ".connectedClientsNumber"
);
const socket = io({ transports: ["websocket"], upgrade: false });
submit.addEventListener("click", (e) => {
  e.preventDefault();
  let pseudo = document.getElementById("pseudo").value;
  if (pseudo.length < 5) {
    return;
  }
  socket.emit("pseudo", pseudo);
  submit.value = "Verifying pseudo...";
  socket.on("pseudoOk", () => {
    pseudoOkP.classList.remove("hidden");
    pseudoOkP.innerText =
      "Your pseudo has been accepted by the verificator XD !";
    form.classList.add("hidden");
    connectedClientsNumber.classList.remove("hidden");
    socket.on("numberChanged", (number) => {
      if (number < 2) {
        connectedClientsNumber.innerText = number + " client connected !";
      } else {
        connectedClientsNumber.innerText = number + " clients connected !";
      }
    });
    sendMessageBox.classList.remove("hidden");
    sendMsg.addEventListener("click", (e) => {
      e.preventDefault();
      socket.emit("msg-sent", textEntry.value);
      textEntry.value = "";
    });
    socket.on("msg-received", (msg) => {
      msgArea.appendChild(document.createTextNode(msg));
      msgArea.appendChild(document.createElement("br"));
    });
  });
});
