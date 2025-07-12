import mongoose from 'mongoose'; 

import bcrypt from 'bcryptjs'

const user_schema= new mongoose.Schema({
    email:{
        type:String,
        required:true,  
            unique: true,
            lowercase:true

    },
       password: {
      type: String,
      required: [true, 'Password is required'],
    },
    username:{
        type:String,
       required:true
    }
})

user_schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model('User', user_schema);
