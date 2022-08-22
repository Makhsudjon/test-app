import dotenv from 'dotenv';
dotenv.config();

//Connect to db
import '../db/connect.js';

import app from '../app.js';
import server from '../server.js';


//Import defined routers
import router from '../routers/index.js';

import '../webSockets/index.js';

//Routes
app.use(router);

server.listen(process.env.PORT, (e)=>{
    if(e){
        console.log(`Cannot connect to server on port: ${process.env.PORT}`);
    }
    console.log(`Server is running on port: ${process.env.PORT}`);
});
