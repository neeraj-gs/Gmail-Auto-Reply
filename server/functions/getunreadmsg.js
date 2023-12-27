//function to find all email that have been unread or unreplied emails, so that we can send messaeg for these maisl
export async function getUnreadEmails(auth){
    const gmail = google.gmail({version:"v1",auth});
    const res = await gmail.users.messages.list({
        userId:"me",
        labelIds:["INBOX"],
        q:"is:unread",
    });
    return res.data.messages || []; //if no unread images , return empty array

}