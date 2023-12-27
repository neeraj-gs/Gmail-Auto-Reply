async function getUnreadEmails(gmail) {
    const res = await gmail.users.messages.list({
        userId: "me",
        labelIds: ["INBOX"],
        q: "is:unread",
    });
    return res.data.messages || [];
}

module.exports = getUnreadEmails;
