//import modules
import express from 'express';
import morgan from 'morgan'
import exphbs from 'express-handlebars'
import helpers from './lib/timeago.js'
import {dirname} from 'path'
import {fileURLToPath} from 'url'
import flash from 'connect-flash';
import session from 'express-session'
import MySQLStore from 'express-mysql-session';
import {config} from './keys.js';
import passport from 'passport'
import bodyParser from 'body-parser'




//import pkg from 'express'
//const{__dirname} = pkg();

//import routes
import index from './routes/index.js'
import authentication from './routes/authentication.js';
import links from './routes/links.js'

//initializations
const app = express();
import './lib/passport.js'

const __dirname= dirname(fileURLToPath(import.meta.url))


//Settings
app.set("port",5000)
app.set("views",(__dirname + "/views"));
app.engine('hbs', exphbs({
    layoutsDir: (app.get('views')+ "/layouts"),
    partialsDir: (app.get('views')+ "/partials"),
    //registerPartialsDir:(__dirname + "/views/partials", 
    extname: 'hbs',
    defaultLayout: 'main',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
  },
    helpers,

}));

app.set('view engine', 'hbs');



//Middlewares
app.use(session({
  secret : 'cristianmysqlsession',
  resave: false,
  saveUninitialized: false,
  store:new MySQLStore(config)
}))
app.use(flash())
app.use(morgan("dev"))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//inicializacion de passport y su metodos de session donde guarda los datos.
app.use(passport.initialize())
app.use(passport.session())



//Global Variables

app.use((req,res,next) =>{
  app.locals.success = req.flash('success');
  app.locals.message = req.flash('message');
  app.locals.user = req.user;
  next();
})

//Routes
app.use(index)
app.use(authentication)
app.use('/links',links)

//Public
app.use(express.static(__dirname + 'public'))

//Listening port
app.listen(app.get('port'),() =>{
  console.log('Server on port'), app.get('port')
})