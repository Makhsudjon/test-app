import server from "../server.js";
import Socket from "../db/models/socket.js";
import User from "../db/models/user.js";

import { Server } from 'socket.io';


const io = new Server(server);

async function createMessage(data){
    const user = await User.findById(data.user);
    const message = {
        from: user.name,
        message: data.message.info
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

io.on('connection', async socket => {
    
    //user-send-message event occures on frontend when one user sends a message to another
    socket.on('user-send-message', async (data) => {
        
        await saveSocket({ user:data.user, socketId:socket.id });
        const message = createMessage(data);
        const userSocketId = await getUserSocketID(data.message.to);
        //user-sent-message event occures on backend when one user sends a message to another
        socket.broadcast.to(userSocketId).emit('user-sent-message', message);
        
    });
});

export default io