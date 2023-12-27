const express = require('express');
const app = express();
const port=8000;

app.get('/',async(req,res)=>{
    res.json({Server: "Login Funcionality "})
})


app.listen(8000,()=>{
    console.log("Go the URL Given Below and Login to your Google Account")
    console.log("http://localhost:8000")
})