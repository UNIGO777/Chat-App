const express = require('express');
const router = express.Router();
const { conversationController } = require('../../controllers/conversation');
const { getConversations } = require('../../controllers/conversation/getConversations');
const { sendMessage } = require('../../controllers/conversation/massages');
router.post('/', conversationController);
router.get('/:userId', getConversations);
router.post('/massages', sendMessage);
module.exports = router;