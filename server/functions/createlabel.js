//function to create a label and append it to a mail
export async function createLabel(auth){
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
        return res.data.id; //returns label id
        
    } catch (error) {
        //if the label is already present , status 409
        // label id is alread presetn we need ot genrate a labelName
        if(error.code === 409){
            const res = await gmail.users.labels.list({
                userId:"me",
            });
            const label = res.data.labels.find((l)=>l.name === labelName);
            return label.id;
        }else{
            throw error;
        }
    }
}