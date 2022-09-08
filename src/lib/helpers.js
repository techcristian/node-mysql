import bcrypt from 'bcryptjs'


const helpers = {};

//ceramos metodo para cifrar la contraseña
helpers.encryptPassword = async (password) =>{
   const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password,salt)
  return hash
  }

//ceramos metodo para comparar contraseñas de ingreso y cifrada en db
helpers.matchPassword = async (password,savedPassword) =>{
 try {
   return await bcrypt.compare(password,savedPassword)
 } catch (error) {
      console.log(error)
 }
}

  export default helpers;