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
  
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    socket.emit("new_msg", input.value, roomName, () => {
      addMsg(`You :  ${input.value}`);
      input.value = "";
    });
  });

  const nameForm = room.querySelector("#name");
  nameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
  });

}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
});

socket.on("welcome", (user) => {
  addMsg(`${user} arrived !`);
});

socket.on("bye", (left) => {
  addMsg(`${left} left ㅠㅠ`);
});

socket.on("new_msg", addMsg);