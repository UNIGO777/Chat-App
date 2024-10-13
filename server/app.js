const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const authRoutes = require('./Routes/authRoutes');
const conversationRoutes = require('./Routes/conversation');
const userRoutes = require('./Routes/users'); // Added user routes
const Conversation = require('./models/conversations');

const io = require('socket.io')(8000, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
    }
});

const cors = require('cors');

mongoose.connect('mongodb://127.0.0.1:27017/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB', err);
});

let users = [];

io.on('connection', (socket) => {
  socket.on('addUser', (userId) => {
    const existingUser = users.find(user => user.userId === userId);
    if (existingUser) {
      existingUser.socketId = socket.id;
    } else {
      socket.userId = userId;
      users.push({userId:userId,socketId:socket.id});
    }
    io.emit('getUsers', users);
  });



  socket.on('sendMessage', async (messageDetails) => { 
    if (!messageDetails.senderId || !messageDetails.receiverId || !messageDetails.text) {
      return;
    }
    const {conversationId, senderId, receiverId, text } = messageDetails;
    console.log(conversationId,senderId,receiverId,"conver")
    
    const user = users.find(user => user.userId === receiverId);

    if (!user) {
      return;
    }

    



    const newMessage = {
      sender: senderId,
      content: text,
      timestamp: {default: Date.now}
    }

    


    
    io.to(user.socketId).emit('getMessage',{conversationId,newMessage})
    
    
  })
  socket.on('disconnect', () => {
    users = users.filter(user => user.socketId !== socket.id);
    io.emit('getUsers', users);
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/users', userRoutes); // Set routes for users

app.get('/', (req, res) => {
  res.send('welcome to the chat app');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
