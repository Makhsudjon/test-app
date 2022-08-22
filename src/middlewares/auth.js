import dotenv from 'dotenv';
dotenv.config();

import User from '../db/models/user.js';
import CustomJWT from '../cryptography/customJWT.js';

import jwt from 'jsonwebtoken';



const auth = async(req, res, next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET||'thisismyjwtsecret');
        //const decoded = CustomJWT.verify(token);
        const user = await User.findOne({ email: decoded.email });
        if(!user){
            return res.status(401).send({success:false, error: 'User with this token is not found'});
        }
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        return res.status(401).send({success:false, error: 'Authorization error'})
    }
}

export default auth