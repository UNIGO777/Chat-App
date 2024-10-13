

const Conversations = require('../../../models/conversations');
const user = require('../../../models/user');

const getConversations = async (req, res) => { 
    try {
        const { userId } = req.params;
        console.log(req.params)
        const conversations = await Conversations.find({ participants: { $in: [userId] } }).populate('participants', 'name email profilePicture');
        
        const conversationUserData = conversations.map(conversation => ({
            conversation: conversation,
            UserData: conversation.participants.filter(participant => participant._id.toString() !== userId)[0]
        }));
        
        // Filter out any null values (in case a user wasn't found)
        const filteredConversationUserData = conversationUserData.filter(Boolean);
        
        res.status(200).json({ conversationUserData: filteredConversationUserData });
    } catch (error) {
        res.status(500).json({ message: 'Error in getting conversations', error: error.message });
    }
}

module.exports = { getConversations };