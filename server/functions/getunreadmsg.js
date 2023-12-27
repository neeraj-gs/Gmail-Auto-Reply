//function used to get all the unread mesages from a users Gmail
async function getUnreadEmails(gmail) {
    const res = await gmail.users.messages.list({
        userId: "me",
        labelIds: ["INBOX"],
        q: "is:unread", //this is the qurry filter that takes in only unread messges and adds into an array
    });
    return res.data.messages || [];
}

module.exports = getUnreadEmails;
