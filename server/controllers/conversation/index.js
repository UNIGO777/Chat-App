const conversations = require('../../models/conversations');

const conversationController = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const conversation = await conversations.findOne({ participants: { $all: [senderId, receiverId] } })
        if (conversation) {
            res.status(200).json({ conversation });
        } else { 
            const newConversation = new conversations({ participants: [senderId, receiverId] })
            await newConversation.save();
            await newConversation.populate('participants', 'name email profilePicture');
            const conversationUserData = {
                conversation: newConversation,
                UserData: newConversation.participants.filter(participant => participant._id.toString() !== senderId)[0]
            }
            res.status(200).json({ conversationUserData });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    conversationController
}