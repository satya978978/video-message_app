import usermodel from '../models/user.js'
import jwt from 'jsonwebtoken'

export const dashboardinfo = async (req,res)=>{
    const cokkie = req.cookies.token
    if (!cokkie) {
      return res.status(401).json({ message: 'No token found' });
    }
     const decoded = jwt.verify(cokkie,process.env.JWT_SECRET)
    const user= await usermodel.findOne({email:decoded.email})
    if (user) {
    res.send(user.username)
    console.log(user.username)

        
    }
 }