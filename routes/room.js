// router
const express = require('express');
const router = express.Router();

/*
    roomlist : Array[room]
    room : {
        title : String,
        users : Array[socket id],
        state : String ['waiting', 'overcapacity'],
        capacity : Number,
    }
*/

//create router form function
// io : socket.io
// roomlist : room array
const roomRouter = (io, Roomlist) => {
    // create room
    // receive room name from client request
    // check duplicate room name
    // if not duplicate, create room and add roomlist
    // if duplicate, send error message to client
    // create Room
    // user connecto to socket
    // add users socket id to users array
    // set State to 'waiting'
    // after create room, redirect to /room/title


    // if you want set capacity, add capacity to body
    router.post('/', (req, res, next) => {
        const title = req.body.title;
        const room = Roomlist.find((room) => {
            return room.title === title;
        });
        if (room) {
            res.send('duplicate');
        } else {
            const newRoom = {
                title: title,
                users: [],
                state: 'waiting',
                capacity: req.body.capacity || 2,
            };
            Roomlist.push(newRoom);
            res.redirect(`/room/${title}`);
        }
    });

    //Enter the room
    //If the room is waiting, add the user to the room
    //If the room is overcapacity, send an error message to the client
    router.get('/:title', (req, res, next) => {
        const title = req.params.title;
        const room = Roomlist.find((room) => {
            return room.title === title;
        });
        if (room.state === 'waiting') {
            res.render('room', { title: title });
        } else {
            res.send('overcapacity');
        }

    });

    // io setting
    io.on('connection', (socket) => {
        // when user connect to socket server send roomlist to client
        socket.emit('roomlist', Roomlist);

        // enter room
        // add socket id to room users array
        // if room users array length is equal to capacity, set state to 'overcapacity'
        socket.on('enter', (title) => {
            const room = Roomlist.find((room) => {
                return room.title === title;
            });
            room.users.push(socket.id);
            if (room.users.length === room.capacity) {
                room.state = 'overcapacity';
            }
            socket.join(title);

            // send enter message to room
            io.to(title).emit('enter', socket.id);
        });

        // user disconnect
        // remove user from room
        // if room is empty, remove room from roomlist
        socket.on('disconnect', () => {
            Roomlist.forEach((room) => {
                const index = room.users.indexOf(socket.id);
                if (index !== -1) {
                    room.users.splice(index, 1);
                    io.to(room.title).emit('leave', socket.id);
                    if (room.users.length === 0) {
                        const roomIndex = Roomlist.indexOf(room);
                        Roomlist.splice(roomIndex, 1);
                        // send roomlist to client
                        io.emit('roomlist', Roomlist);
                    }
                }
            });
        });
    });

    return router;
}

module.exports = roomRouter;