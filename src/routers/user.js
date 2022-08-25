import User from '../db/models/user.js';
import Message from '../db/models/message.js';
import auth from '../middlewares/auth.js';
import CustomError from '../utils/custom.error.js';
import upload from '../middlewares/upload.js';
import utils from '../utils/utils.js';
import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('user/login');
});

router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await User.findByCredentials( name, password);
        const token = user.genereteToken();
        user.tokens = user.tokens.concat({token}); 
        await user.save();
        return res.send(CustomError.Success(user, token));
    } catch (e) {
        console.log(e);
        res.status(500).send(CustomError.UnknownError(e.message));
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        const user = req.user;
        await user.removeToken(req.token);
        delete req.token;
        return res.send(CustomError.Success());      
    } catch (e) {
        res.status(500).send(CustomError.UnknownError(e.message));
    }
});

router.post('/logoutAll', auth, async (req, res) => {
    try {
        const user = req.user;
        await user.removeAllTokens();
        delete req.token;
        return res.send(CustomError.Success(user));      
    } catch (e) {
        res.status(500).send(CustomError.UnknownError(e.message));
    }
});

router.get('/profile', auth, async (req, res) => {
    const user = req.user;
    res.send(CustomError.Success(user));
});


router.get('/register', (req, res) => {
    res.render('user/register');
});

router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body); 
        user.password = await bcrypt.hash(user.password, 8);
        await user.save();
        return res.status(201).send(CustomError.Success());
    } catch (e) {
        console.log(e);
        res.status(500).send(CustomError.UnknownError(e));
    }
});

router.get('/list', auth, async (req, res) => {
    try {
        const users = await User.find();
        return res.send(CustomError.Success(users));
    } catch (e) {
        res.status(500).send(CustomError.UnknownError(e.message));
    }
});

router.patch('/me', auth, async (req, res)=>{
    const user = req.user;
    const data = req.body;
    const updates = Object.keys(data);
    const allowedUpdates = ['name', 'email', 'age', 'password'];

    const is = updates.every(update=>allowedUpdates.includes(update));

    if(!is){
        return res.status(400).send(CustomError.BadRequest());
    }

    if(data.password){
        data.password = await bcrypt.hash(data.password, 8);
    }   

    try{
        const token = user.genereteToken();
        user.tokens = user.tokens.concat({token}); 
        updates.forEach(update=>user[update]=data[update])
        await user.save();
        return res.send(CustomError.Success(user, token));
    } catch(e){
        res.status(500).send(CustomError.UnknownError(e.message));
    }
});

router.delete('/me', auth, async (req, res)=>{
    try{  
        const user = req.user;      
        await user.remove();
        return res.send(CustomError.Success(user));
    } catch(e){
        res.status(500).send(CustomError.UnknownError(e.message));
    }
});

router.get('/send-message', (req, res) => {    
    res.render('user/message');
});

router.post('/send-message', auth, upload.single('uploaded_file'), async (req, res) => {
    try {
        const messageData = {
            ...req.body,
            from: req.user._id,
            file: req.file.path
        }
        const message = new Message(messageData);
        await message.save();
        res.send(CustomError.Success());
    } catch (e) {  
        res.status(500).send(CustomError.UnknownError(e.message));
    }
});

export default router;