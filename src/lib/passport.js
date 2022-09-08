import passport from 'passport';
import passportLocal from 'passport-local';
import {connect} from '../database.js';
import helpers from './helpers.js'

const LocalStrategy = passportLocal.Strategy

//passport para login
passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},async(req,username,password,done)=>{
    const connection = await connect();
    const [rows]= await connection.query('SELECT * FROM users WHERE username=?',[username])
   
    if(rows.length > 0){
      const user= rows[0]
      
      //comparo contraseñas y me devuelve un true o un falso de la comparacoion de contraseñas
     const validPassword = await helpers.matchPassword(password, user.password)
      if(validPassword) {
        //con el callback done le paso a passport el user para serializarlo y deserializarlo por id.
        done(null,user,req.flash('success','Welcome'))
      }else{
        done(null,false,req.flash('message','Incorrect password'))
      }
   } else {
    return done(null,false,req.flash('message','Incorrect username'))
   }
  }));

//passport para registro
 passport.use('local.signup', new LocalStrategy({
  usernameField:'username',
  passwordField:'password',
  passReqToCallback: true
},async (req,username,password,done)=>{
   const {fullname} = req.body;
  
   const newUser ={
    username,
    password,
    fullname
   }; 
   newUser.password = await helpers.encryptPassword(password)
    const connection = await connect();
   const [result] = await connection.query('INSERT INTO users SET ?',newUser);
   console.log(result)
   newUser.id = result.insertId;
    done(null, newUser) //devuelve solo con (done) y no lleva return porque sino no me muestra los datos de la variable global user!!!!
}));

//usamos el metodo serializeUser para guardar el usuario en la session de passport
passport.serializeUser((user,done) =>{
    done(null,user.id)
});
//traigo todos los datos desde la db al deserializar el usuario por su id
passport.deserializeUser(async (id,done) => {
   const connection = await connect();
  const [rows] = await connection.query('SELECT * FROM users WHERE ID= ?',[id])
  
  done(null,rows[0])
});
