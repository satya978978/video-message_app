import usermodel from '../models/user.js';
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { response } from 'express';
export const registerUser = async (req, res) => {
    try {
        console.log("first")
        const { email, password, username } = req.body
         console.log(email,password,username)
        if (await usermodel.findOne({ email })) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new usermodel({ email, password, username })
        await user.save()
        
         const token = jwt.sign({email},process.env.JWT_SECRET)
          res.cookie('token',token,{
            httpOnly:true,
            secure:false,
            sameSite:'Lax'
          })
        res.status(201).json({ message: 'ok' });
    }
    catch (err) {
        console.error("Error during user registration:", err);
        res.status(500).json({ message: "Internal server error" });
    }



}

export const loginuser = async (req, res) => {
    console.log("coming")
    const { email, password } = req.body
    const userexists = await usermodel.findOne({ email: email })
    if (!userexists) return res.status(400).json({ message: "User does not exist" });


    const ismatching = await bcrypt.compare(password, userexists.password)
    if (!ismatching) return res.status(401).json({ message: "Invalid credentials" });


    const token = jwt.sign({ email: email }, process.env.JWT_SECRET)
    res.cookie('token', token, { httpOnly: true });
    console.log("gya")
    res.json({
        message: "ok"
    })
}

