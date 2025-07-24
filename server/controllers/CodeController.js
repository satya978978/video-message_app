import axios from 'axios';
export const RunCode= async (req,res)=>{

   try{
     console.log("a rha hai back")
   const {code,backlanguage }= req.body
    const result =   await axios.post("https://api.jdoodle.com/v1/execute",{
        clientId:"d8665baee36a9c24e75d1142800ff5aa",
        clientSecret:"de6259375c4e90f82664fb92b18cc3abbb93ab67d8d3bca6dc80dab05ee28e35",
        script:code
        , versionIndex:"3",
        language:backlanguage || 'nodejs'
    })
  res.json({output:result.data.output})
  console.log(result.data.output)
   }
   
   catch (err){
    console.log("hoee")
    console.log(err)
   }
 }