const socket_io = require("socket.io");
const io = socket_io();

let Socket = {
    emit: (event, data) => {
        io.sockets.emit(event, data);
    }
};

io.on("connection", (socket) => {
    console.log('usuario conectado' + socket.id);
});

exports.socketConnection = {"io": io, "socket": Socket};
