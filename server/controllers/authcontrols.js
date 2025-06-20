const usermodel = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.registerUser = async (req, res) => {
    try {
console.log("first")
        const { email, password, username } = req.body

      if (await usermodel.findOne({ email })) {
  return res.status(400).json({ message: "User already exists" });
}

        const user = new usermodel({ email, password, username })
        await user.save()
   
        res.status(201).json({ message: 'ok' });
    }
 catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ message: "Internal server error" });
}



}

exports.loginuser = async (req, res) => {
    const { email, password } = req.body
    const userexists =await usermodel.findOne({ email: email })
if (!userexists) return res.status(400).json({ message: "User does not exist" });


    const ismatching = await bcrypt.compare(password, userexists.password)
if (!ismatching) return res.status(401).json({ message: "Invalid credentials" });


    const token = jwt.sign({ email: email }, process.env.JWT_SECRET)
    res.cookie('token', token, { httpOnly: true });

    res.json({
        message: "ok"
    })
}