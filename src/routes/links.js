import express from 'express';
import {connect} from '../database.js';
import { isLoggetIn } from '../lib/auth.js';



const router = express.Router();

router.get('/add',isLoggetIn, (req,res) =>{
  res.render('links/add')
});

/* A post request to the route /add. It is receiving the data from the form and saving it in the
database. */
router.post('/add',isLoggetIn, async (req,res) =>{
  console.log(req.body)
  const {title,url,description} = req.body;
  const newLink = {
    title,
    url,
    description,
    user_id: req.user.id
  };
  console.log(newLink)
  const connection = await connect()
   await connection.query('INSERT INTO links set ?',[newLink ])
  req.flash('success','link saved successfully')
  res.redirect('/links')
});

router.get('/',isLoggetIn, async(req,res) => {
  const connection = await connect()
  const [links] = await connection.query('SELECT * FROM  links WHERE user_id=?',[req.user.id])
  console.log(links)
  res.render('links/list',{links})
});

router.get('/delete/:id',isLoggetIn, async (req,res) =>{
  const {id} = req.params;
  console.log(id)
  const connection = await connect();
  await connection.query('DELETE FROM links WHERE ID= ?',[id])
  req.flash('success','Link was deleted successfylly ')
  res.redirect('/links')
});

router.get('/edit/:id',isLoggetIn,async (req,res) =>{
  const {id} = req.params;
  const connection = await connect();
  const [link] = await connection.query('SELECT * FROM links WHERE ID=?',[id])
  console.log(link[0])
  res.render('links/edit',{link:link[0]})
});

 router.post('/edit/:id',isLoggetIn,async (req,res) =>{
  const {id} = req.params;
  const {title,description,url} = req.body;
 const newLinkEdit={
  title,
  description,
  url
 }
 console.log(newLinkEdit)
 const connection = await connect()
 await connection.query('UPDATE links set ? WHERE ID=? ',[newLinkEdit,id])
 req.flash('success','Link was edited successfully')
 res.redirect('/links')
 });



export default router;