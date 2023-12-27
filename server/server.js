const express = require('express');
const app = express();
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');
const fs = require('fs').promises;
const {google} = require('googleapis');
const { createLabel } = require('./functions/createlabel');
const { getUnreadEmails } = require('./functions/getunreadmsg');



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

        //Repeat the process of read, reply at regular intervals
        setInterval(async()=>{

            const msg = await getUnreadEmails(auth); //gettting unread messages and unreplied messages

            //check if there are any mails that are not yet repalied
            if(msg && msg.length > 0) {
                for(const m of msg){
                    const message = await gmail.users.messages.get({
                        auth,
                        userId:"me",
                        id:m.id,
                    })

                    const email = message.data;
                    //frommteh unread messages , need to check if theere are any unreplied messages
                    const replied = email.payload.headers.some((h)=> h.name === "In-Reply-To"); //if inreplyto is preset inheader, then we have already tpliedto teh mail

                    if(!replied){
                        const replyMsg={
                            userId:"me",
                            resource:{
                                raw:Buffer.from(
                                    `To:${email.payload.headers.find((h)=>h.name==="From").value}\r\n` + 
                                    `Subject: Re: ${email.payload.headers.find((h)=>h.name==="Subject").value}\r\n` +
                                    `Content-Type: text/plain; charset="UTF-8"\r\n` + 
                                    `Content-Transfer-Encoding: 7bit\r\n\r\n` + 
                                    `Thank You For Sending Me Your Email.\n\n I am Currently Unavailable and will revert back to you very Soon.\n\n Thank You.`
                                ).toString("base64"),
                            }
                        }
                    }


                }
            }



        }, Math.floor(Math.random()*(120-45+1)+45)*1000) //40 - 120 sec max -min +1 and returns random interval time between 45 and 120 sec



    }


    


    
})





app.listen(port,()=>{
    console.log("Go the URL Given Below and Login to your Google Account")
    console.log("http://localhost:8000")
})