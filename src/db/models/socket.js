import mongoose from 'mongoose';

const socketSchemaOptions = {
    versionKey:false,
    timestamps:true
}

const socketSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    socketId:{
        type:String,
        required:true
    }
}, socketSchemaOptions);

socketSchema.methods.toJSON = function(){
    const socket = this.toObject();
    delete socket.createdAt;
    delete socket.updatedAt;
    return socket;
}

const Socket = mongoose.model('Socket', socketSchema);

export default Socket