const { Conversation } = require('../db.js');
const { Op } = require("sequelize");

const convoVerify = async (req, res, next) => {
    try {
        const { senderId, receiverId, } = req.body;

        if (senderId === receiverId) return res.status(400).send('No puedes conversar contigo mismo')

        // Check if a conversation exists between sender and receiver
        const conversation = await Conversation.findOne({
            where: {
                [Op.or]: [
                    { participant1Id: senderId, participant2Id: receiverId },
                    { participant1Id: receiverId, participant2Id: senderId },
                ],
            },
        });
        // If conversation doesn't exist, create a new one
        if (!conversation) {
            const newConversation = await Conversation.create({
                participant1Id: senderId,
                participant2Id: receiverId,
            });
            req.body.conversationId = newConversation.id;     
        } else {
            req.body.conversationId = conversation.id
        }

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ error: 'Failed to create conversation.' });
    }
};


module.exports = convoVerify;
