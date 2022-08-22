import app from './app.js';
import { createServer } from 'http';


const server = createServer(app);

export default server;
