async function main(auth,labelName,google,res){

    const gmail = google.gmail({version:"v1",auth})
    //create a label for the App
    const labelId = await createLabel(gmail,labelName)

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
                                `Subject: Regarding: ${email.payload.headers.find((h)=>h.name==="Subject").value}\r\n` +
                                `Content-Type: text/plain; charset="UTF-8"\r\n` + 
                                `Content-Transfer-Encoding: 7bit\r\n\r\n` + 
                                `Thank You For Sending Me Your Email.\n\n I am Currently Unavailable and will revert back to you very Soon.\n\n Thank You.`
                            ).toString("base64"),
                        }
                    }
                    await gmail.users.messages.send(replyMsg);

                    //adding label and to teh eamil that is sent
                    await gmail.users.messages.modify({ //movinf to hte next email affter adding label
                        auth,
                        userId:"me",
                        id:m.id,
                        resource:{
                            addLabelIds:[labelId],
                            removeLabelIds:["INBOX"],
                        }
                    })
                }
            }
        }
    }, Math.floor(Math.random()*(120-45+1)+45)*1000) //40 - 120 sec max -min +1 and returns random interval time between 45 and 120 sec
}