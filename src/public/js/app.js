const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMsg(msg) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room : ${roomName}`;
  
  const form = room.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = room.querySelector("input");
    socket.emit("new_msg", input.value, roomName, () => {
      addMsg(`You :  ${input.value}`);
      input.value = "";
    });
  });

}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
});

socket.on("welcome", () => {
  addMsg("someone joined!");
});

socket.on("bye", () => {
  addMsg("someone left ㅠㅠ");
});

socket.on("new_msg", addMsg);