const submit = document.querySelector(".submit");
const morpionDiv = document.querySelector(".morpion");
const form = document.querySelector("form");
const loginInfos = document.querySelector(".loginInfos");
const msgArea = document.querySelector(".msgArea");
const sendMessageBox = document.querySelector(".sendMessageBox");
const pseudoOkP = document.querySelector(".pseudoOk");
const sendMsg = document.querySelector(".sendMsg");
const textEntry = document.querySelector(".textEntry");
// const connectedClientsNumber = document.querySelector(
//   ".connectedClientsNumber"
// );
const connectedClientsNumber = document.getElementsByClassName("connectedClientsNumber");
const sendIcon = document.querySelector(".sendIcon");
var socket = null;
submit.addEventListener("click", (e) => {
  e.preventDefault();
  let pseudo = document.getElementById("pseudo").value;
  submit.value = "Verifying pseudo...";
  if (socket === null) {
    socket = io();
    socket.emit("pseudo", pseudo);
    socket.on("badPseudo", () => {
      alert(
        "Your usename cannot contains spaces, must have at least 5 caracters and must begin by a letter (not a number)"
      );
      submit.value = "Se connecter au chat";
      return;
    });
    socket.on("alreadyConnected", () => {
      alert("Someone with your username is already connected !");
      submit.value = "Se connecter au chat";
      return;
    });
    socket.on("pseudoOk", () => {
      pseudoOkP.classList.remove("hidden");
      pseudoOkP.innerText =
        "Your pseudo has been accepted by the verificator XD !";
      form.classList.add("hidden");
      connectedClientsNumber[0].classList.remove("hidden");
      sendMessageBox.classList.remove("hidden");
      sendMsg.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("sendMsg");
        socket.emit("msg-sent", textEntry.value);
        textEntry.value = "";
      });
      sendIcon.addEventListener("click",(e)=>{
        console.log("sendIcon");
        socket.emit("msg-sent", textEntry.value);
        textEntry.value = "";
      })
      socket.on("numberChanged", (number) => {
      if (number < 2) {
        connectedClientsNumber[0].innerText = number + " client connected !";
        connectedClientsNumber[1].innerText = number + " client connected !";
      } else {
        connectedClientsNumber[0].innerText = number + " clients connected !";
        connectedClientsNumber[1].innerText = number + " clients connected !";
      }
    });
    socket.on("msg-received", (msg) => {
      console.log("msg-received !");
      let textNode = document.createElement("p");
      if(msg[0]==="Toi"){
        textNode.innerText = msg[1];
      } else if(msg[0]!="serv"){
        textNode.innerText = msg[0]+" : "+msg[1];
      } else{
        textNode.innerText = msg[1];
      }
      if(msg[0]==="Toi"){
        textNode.classList.add("you");
      }else{
        textNode.classList.add("someone");
      }
        msgArea.appendChild(textNode);
        // msgArea.appendChild(document.createElement("br"));
        location.replace("http://90.125.35.111:8888/app#enterYourMsg")
    });
    });
    
    
  }
});