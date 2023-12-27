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


    //function to find all email that have been unread or unreplied emails, so that we can send messaeg for these maisl
    async function getUnreadEmails(auth){
        const gmail = google.gmail({version:"v1",auth});
        const res = await gmail.users.messages.list({
            userId:"me",
            labelIds:["INBOX"],
            q:"is:unread",
        });
        return res.data.messages || []; //if no unread images , return empty array

    }


    //function to create a label and append it to a mail
    async function createLabel(auth){
        const gmail = google.gmail({version:"v1",auth});
        try {
            const res = await gmail.users.labels.create({
                userId:"me",
                requestBody:{
                    name:labelName,
                    labelListVisibility:"labelShow",
                    messageListVisibility:"show",
                }
            })
            return res.data.id;
            
        } catch (error) {
            
        }
    }





})





app.listen(port,()=>{
    console.log("Go the URL Given Below and Login to your Google Account")
    console.log("http://localhost:8000")
})