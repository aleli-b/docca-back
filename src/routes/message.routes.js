const { Router } = require('express');
const router = Router();
const messageController = require('../controllers/turno.controller');
const convoVerify = require('../middlewares/createConversation.js');
const { User, Conversation, Message } = require('../db.js');

router.post('/messages', convoVerify, async (req, res) => {
    try {
        const { content, senderId, receiverId, conversationId } = req.body;
        const message = await Message.create({ content, senderId, receiverId, conversationId });
        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message.' });
    }
});

// Get User's Conversations
router.get('/conversations/user', async (req, res) => {
    try {
        const { userId } = req.query;
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: Conversation,
                    as: 'participant1Conversations',
                    include: [
                        {
                            model: Message,
                            as: 'messages',
                            include: [
                                {
                                    model: User,
                                    as: 'sender', // Include the sender user
                                    attributes: { exclude: ['password'] }, // Exclude sensitive data like password
                                },
                                {
                                    model: User,
                                    as: 'receiver', // Include the receiver user
                                    attributes: { exclude: ['password'] }, // Exclude sensitive data like password
                                },
                            ],
                        },
                        {
                            model: User,
                            as: 'participant1',
                            attributes: { exclude: ['password'] },
                        },
                        {
                            model: User,
                            as: 'participant2',
                            attributes: { exclude: ['password'] },
                        },
                    ],
                },
                {
                    model: Conversation,
                    as: 'participant2Conversations',
                    include: [
                        {
                            model: Message,
                            as: 'messages',
                            include: [
                                {
                                    model: User,
                                    as: 'sender', // Include the sender user
                                    attributes: { exclude: ['password'] }, // Exclude sensitive data like password
                                },
                                {
                                    model: User,
                                    as: 'receiver', // Include the receiver user
                                    attributes: { exclude: ['password'] }, // Exclude sensitive data like password
                                },
                            ],
                        },
                        {
                            model: User,
                            as: 'participant1',
                            attributes: { exclude: ['password'] },
                        },
                        {
                            model: User,
                            as: 'participant2',
                            attributes: { exclude: ['password'] },
                        },
                    ],
                },
            ],
        });

        // Combine the conversations from both aliases into a single array
        const conversations = [
            ...user.participant1Conversations.map((c) => ({
                ...c.toJSON(),
                participant: c.participant1, // Assign participant data to a 'participant' key
            })),
            ...user.participant2Conversations.map((c) => ({
                ...c.toJSON(),
                participant: c.participant2, // Assign participant data to a 'participant' key
            })),
        ];

        res.json(conversations);
        console.log(conversations)
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Failed to fetch conversations.' });
    }
});

// Get Messages in a Conversation
router.get('/conversations/messages', async (req, res) => {
    try {
        const { conversationId } = req.body;
        const conversation = await Conversation.findByPk(conversationId, {
            include: {
                model: Message,
                as: 'messages'
            },
        });
        res.json(conversation.messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
});

// Mark Message as Read
router.put('/messages/:messageId/read', async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findByPk(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found.' });
        }
        message.isRead = true;
        await message.save();
        res.json({ message: 'Message marked as read.' });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ error: 'Failed to mark message as read.' });
    }
});

module.exports = router;