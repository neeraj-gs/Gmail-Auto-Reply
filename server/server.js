const express = require('express');
const app = express();
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');
const fs = require('fs').promises;
const {google} = require('googleapis')



const port=8000;

//these are the scopes that we will be accessing from our gmail account
const scope = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.labels",
    "https://mail.google.com/"
]

const label = "Gmail Auto-Reply" //label name attached to mail after sending a reply


app.get('/',async(req,res)=>{
    res.json({Server: "Login Funcionality "})
})


app.listen(8000,()=>{
    console.log("Go the URL Given Below and Login to your Google Account")
    console.log("http://localhost:8000")
})