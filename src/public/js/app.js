const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick"); // nickname form
const messageForm = document.querySelector("#message"); // message form
const socket = new WebSocket(`ws://${window.location.host}`); // connect to backend

function makeMsg(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
  console.log("Connected to server !! ");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Close server !!");
});

// message form submit
messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMsg("new_msg", input.value)); // frontend form -> backend
  input.value = "";
});

// nickname form submit
nickForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMsg("nickname", input.value));
  input.value = "";
});