import axios from 'axios';
import { version } from 'mongoose';
export const RunCode=(req,res)=>{
   const {code }= req.body
    const result = axios.post("https://api.jdoodle.com/v1/execute",{
        clientid:"d8665baee36a9c24e75d1142800ff5aa",
        clientSecret:"de6259375c4e90f82664fb92b18cc3abbb93ab67d8d3bca6dc80dab05ee28e35",
        script:code
        , versionIndex:"3",
        language:"nodejs"
    })
  res.json({output:result.data.output})
  console.log(result.data.output)
 }