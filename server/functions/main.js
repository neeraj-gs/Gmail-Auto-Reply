const createLabel = require("./createlabel");
const getUnreadEmails = require("./getunreadmsg");

//main function that performs all the operations, in a specific time interval
async function main(auth,labelName,google,res){
    //creates an object trough which we can interact with the GMail API
    const gmail = google.gmail({version:"v1",auth})
    console.log(gmail)
    //create a label for the App
    const labelId = await createLabel(gmail,labelName)
    console.log(labelId)
    //Repeat the process of read, reply at regular intervals[Between 45 - 120 seconds]
    setInterval(async()=>{
        const msg = await getUnreadEmails(gmail); //gettting unread messages from mail
        //check if there are any mails that are not yet repalied
        if(msg && msg.length > 0) { //if tehre is atleast 1 msg that is unread.,loop through taht messages
            for(const m of msg){
                //fetches the message
                const message = await gmail.users.messages.get({
                    auth,
                    userId:"me",
                    id:m.id,
                })
                console.log(message)
                //gets the email data from the message recieved
                const email = message.data;
                console.log(email)
                //frommteh unread messages , need to check if theere are any unreplied messages
                const replied = email.payload.headers.some((h)=> h.name === "In-Reply-To"); //if inreplyto is preset inheader, then we have already tpliedto teh mail

                if(!replied){
                    const replyMsg={
                        userId:"me",
                        resource:{
                            raw:Buffer.from(
                                `To:${email.payload.headers.find((h)=>h.name==="From").value}\r\n` +  //from email address is taken 
                                `Subject: Regarding: ${email.payload.headers.find((h)=>h.name==="Subject").value}\r\n` + //Addds Rgardign at the start and takes the subject of msg
                                `Content-Type: text/plain; charset="UTF-8"\r\n` +  //
                                `Content-Transfer-Encoding: 7bit\r\n\r\n` + 
                                `Thank You For Sending Me Your Email.\n\n I am Currently Unavailable and will revert back to you very Soon.\n\n This is My Bot Replying.I will get in touch soon.\n\n\n\n Thank You.` //body of email
                            ).toString("base64"), //base64 is required for GMAIL APIs raw message format
                        }
                    }
                    //sedms the construcuted message reply to the sender.
                    await gmail.users.messages.send(replyMsg);
                    //adding label and to teh eamil that is sent
                    await gmail.users.messages.modify({ //moving to the next email affter adding a label
                        auth,
                        userId:"me",
                        id:m.id,
                        resource:{
                            addLabelIds:[labelId],
                        }
                    })
                }
            }
        }
    }, Math.floor(Math.random()*(120-45+1)+45)*1000) //40 - 120 sec max -min +1 and returns random interval time between 45 and 120 sec
}

module.exports=main;