const Conversation = require('../../../models/conversations');

const sendMessage = async (req, res) => {
    try {
        const { conversationId, senderId, text } = req.body;
      

        if (!conversationId || !senderId || !text) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (!conversation.participants.includes(senderId)) {
            return res.status(403).json({ message: 'User is not a participant in this conversation' });
        }

        const newMessage = {
            sender: senderId,
            content: text,
            timestamp: new Date()
        };

        conversation.messages.push(newMessage);
        conversation.lastUpdated = new Date();

        await conversation.save();

        res.status(200).json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
};

module.exports = { sendMessage };
