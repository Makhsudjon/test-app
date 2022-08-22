import userRouter from './user.js';


import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
})
router.use('/user', userRouter);

export default router; 