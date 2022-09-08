import express from 'express';
import passport from 'passport'
import { isLoggetIn,isNotLoggedIn } from '../lib/auth.js';


const router = express.Router();
//Signup
router.get('/signup',isNotLoggedIn, (req,res) =>{
  res.render('auth/signup')
})

router.post('/signup',isNotLoggedIn,passport.authenticate('local.signup',{
  successRedirect:'/profile',
  failureRedirect: '/signup',
  failureFlash: true

 }))

//Signin
router.get('/signin',isNotLoggedIn, (req,res) =>{
  res.render('auth/signin')
});
router.post('/signin',isNotLoggedIn,(req,res,next)=> {
 passport.authenticate('local.signin',{
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
 })(req,res,next);
})

//profile
router.get('/profile',isLoggetIn,(req,res) =>{
 
  res.render('profile')
})

//logout
 router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/signin');
  });
});




export default router;