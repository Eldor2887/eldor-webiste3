const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const keys = require('./config/keys');

const mongoose = require('mongoose');
mongoose.connect(keys.MongoURI);
const messageSchema = mongoose.Schema;
const Message = mongoose.model('message', new messageSchema({
	email: {
		type: String
	},
	message: {
		type: String
	}
}));

const app = express();
const publicPath = path.join(__dirname, './public');
const port = process.env.PORT || 3000;
app.use(express.static(publicPath));

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
	console.log('Connected to Client');
	socket.on('newMessage', (message) => {
		console.log(message);
		var messages = new Message({
			email: message.email,
			message: message.message
		}).save();
	});
});

io.on('disconnect', (socket) => {
	console.log('Disconnected from Client');
});

server.listen(port, () => {
    console.log(`Eldorweb is running on port ${port}`);
});