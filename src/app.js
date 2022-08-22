import utils from './utils/utils.js';
import express from 'express';
import expressHbs from 'express-handlebars';
import hbs from 'hbs';
import path from 'path';

const __dirname = utils.getFileDirectory(import.meta.url);

const app = express();

app.engine('hbs', expressHbs.engine({
    layoutsDir: 'src/templates/layouts',
    defaultLayout: 'layout',
    extname: 'hbs',
    partialsDir: 'src/templates/partials'
}))

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'templates/views'));
hbs.registerPartials(path.join(__dirname, 'templates/partials'));


app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use(express.static(path.join(__dirname, 'public')));

export default app;
