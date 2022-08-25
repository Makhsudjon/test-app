import server from "../server.js";
import Socket from "../db/models/socket.js";
import User from "../db/models/user.js";

import { Server } from 'socket.io';


const io = new Server(server);

async function createMessage(data){
    const user = await User.findById(data.to);
    const message = {
        from: user.name,
        message: data.message
    };
    return message;
}

async function getUserSocketID(userId){
    const socket = await Socket.findOne({user: userId});
    return socket.socketId;
}

async function saveSocket(data){
    const socket = new Socket(data);
    await socket.save();
}

io.on('connection', socket => {
   console.log('User connected with socket id: ', socket.id); 
    //user-send-message event occures on frontend when one user sends a message to another
    socket.on('login', async data => {
        console.log(`User id: ${data}`);
        await saveSocket({ user:data.user, socketId:socket.id });
    });
    socket.on('message', async (data) => {       
        const message = createMessage(data);
        console.log('message', data);
        const userSocketId = await getUserSocketID(data.to);
        console.log('message', data);
        //user-sent-message event occures on backend when one user sends a message to another
        io.sockets.sockets[userSocketId].emit('message', message);
        
    });

    socket.on('disconnect', async () => {
        const sockets = await Socket.find();
        console.log('Current Sockets: ', sockets);
    });
});

export default io