const mongoose = require('mongoose')

const dotenv = require('dotenv');
dotenv.config();
const db = async ()=>{
    try{
            await mongoose.connect(process.env.MONGO_DB_URL, {
          
        });
        console.log('MongoDB connected successfully');
    }
    catch (err){
        console.log(`you have error in mongo db connection-- ${err}`)
    }
}
module.exports=db


