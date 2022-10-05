// client file

// connect socket server
// when user connect to socket server send roomlist to client

// import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io("http://localhost:3001", {
    cors: {
        origin: "*", // allow all origin
    }
});

socket.on("roomlist", (roomlist) => {
    console.log(roomlist);
    // add roomlist to html
    // table id = rooms
    // tbody id = table-body
    // td : class td-title, td-capacity, td-state
    let tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
    roomlist.forEach((room) => {
        let row = document.createElement("tr");
        let title = document.createElement("td");
        title.setAttribute("class", "td-title");
        title.innerHTML = room.title;
        let capacity = document.createElement("td");
        capacity.setAttribute("class", "td-capacity");
        capacity.innerHTML = room.capacity;
        let state = document.createElement("td");
        state.setAttribute("class", "td-state");
        state.innerHTML = room.state;
        row.appendChild(title);
        row.appendChild(capacity);
        row.appendChild(state);
        tableBody.appendChild(row);
    });

    // add click event to roomlist
    let roomTitles = document.getElementsByClassName("td-title");
    for (let i = 0; i < roomTitles.length; i++) {
        // move to /room/title
        roomTitles[i].addEventListener("click", () => {
            location.href = `/room/${roomTitles[i].innerHTML}`;
        });

    }
    
});