const express = require('express');
const app = express();
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');
const fs = require('fs').promises;
const {google} = require('googleapis');
const { createLabel } = require('./functions/createlabel');



const port=8000;

//these are the scopes that we will be accessing from our gmail account
const scope = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.labels",
    "https://mail.google.com/"
]

const labelName = "Gmail Auto-Reply" //label name attached to mail after sending a reply


app.get('/',async(req,res)=>{
    //google auth authentication to login to gmail account
    const auth = await authenticate({
        keyfilePath: path.join(__dirname,"credentials.json"),
        scopes:scope
    })

    //taking hte authorized gmial id after login
    const gmail = google.gmail({version:"v1",auth});
    console.log(gmail)

    //get all the labels present for the email
    const AllLables = await gmail.users.labels.list({
        userId:"me"
    })

    async function main(){
        //create a label for the App
        const labelId = await createLabel(auth)



    }


    


    
})





app.listen(port,()=>{
    console.log("Go the URL Given Below and Login to your Google Account")
    console.log("http://localhost:8000")
})