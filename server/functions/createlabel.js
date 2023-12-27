//function to create a label , if already not present and add the message to the label
async function createLabel(gmail, labelName) {
    try {
        //create a new label with specified labelName and visibilitues
        const res = await gmail.users.labels.create({
            userId: "me",
            requestBody: {
                name: labelName,
                labelListVisibility: "labelShow",
                messageListVisibility: "show",
            }
        });
        //if label is created succesfuly it will return the label id
        return res.data.id;
    } catch (error) {
        if (error.code === 409) { //if label already exists for gmail accunt and lists all the labels associated with it
            const res = await gmail.users.labels.list({ userId: "me" });
            const label = res.data.labels.find((l) => l.name === labelName); //searches for existing laebl by name and returns the id
            return label.id;
        } else {
            throw error; //no conflict
        }
    }
}

module.exports = createLabel;