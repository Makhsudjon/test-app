import mongoose from 'mongoose';

const messageSchemaOptions = {
    versionKey:false,
    timestamps:true
}

const messageSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    file:{
        type:String
    },
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
}, messageSchemaOptions);

messageSchema.methods.toJSON = function(){
    const message = this.toObject();
    delete message.createdAt;
    delete message.updatedAt;
    return message;
}

const Message = mongoose.model('Message', messageSchema);

export default Message