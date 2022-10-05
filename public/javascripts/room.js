import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io("http://localhost:3001", {
    cors: {
        origin: "*", // allow all origin
    }
});

// get roomtitle
let roomTitle = document.getElementById("room-title").value;

//enter the room
socket.emit("enter", roomTitle);

// when user enter the room
socket.on("enter", (socketId) => {
    console.log(socketId);
    // add user to html
    // ul id = users
    let users = document.getElementById("users");
    let user = document.createElement("li");
    user.setAttribute("id", socketId);
    user.innerHTML = socketId;
    users.appendChild(user);
});