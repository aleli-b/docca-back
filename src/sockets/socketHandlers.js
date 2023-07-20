// handleSocketConnection.js
const { User, Conversation, Message } = require('../db.js');

// Function to handle socket connections
const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('sendMessage', async (data) => {
      try {
        // Extract necessary data from the received message
        const { content, senderId, receiverId, conversationId } = data;

        // Emit a "newMessage" event to other participants in the conversation
        io.to(conversationId).emit('newMessage', data);

        console.log('Message broadcasted:', data);
      } catch (error) {
        console.error('Error broadcasting message:', error);
      }
    });

    socket.on('joinConversation', (conversationId) => {
      // Join the socket room associated with the conversation
      socket.join(conversationId);
      console.log(`User ${socket.id} joined conversation ${conversationId}`);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
      // Handle user disconnections, if needed
    });
  });
};

module.exports = handleSocketConnection;