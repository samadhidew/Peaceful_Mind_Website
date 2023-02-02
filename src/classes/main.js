'use strict'
var express = require('express'),
    socketIo = require('socket.io'),
    mongoose = require('mongoose'),
    http = require('http');

class Server {
    constructor(host,port) {
        this.express = express;
        this.app = express();
        this.server = http.Server(this.app);
        this.io = socketIo(this.server);
        this.server.listen(port,(err)=> {
            console.log(`Server listening on port ${port}.`);
        });
        this.connectDb();
        this.loadSchemas();
    }

    connectDb() {
        let url = 'mongodb://localhost:27017/chat2';
        mongoose.connect(url, (err)=> {
            if(err){
                throw err;
            }
            console.log('Connected to Database.');
        });
        mongoose.Promise = global.Promise;
    }

    loadSchemas() {
        let UsersSchema = new mongoose.Schema({
            _id: mongoose.Schema.Types.ObjectId,
            name: {
                type: String,
                required: true
            },
            email: { 
                type: String,
                unique: true,
                required: true,
                trim: true
            },
            username: {
                type: String,
                unique: true,
                required: true,
                trim: true
            },
            password: {
                type: String,
                required: true
            },
            dp: Buffer,
            created: {
                type: Date,
                default: Date.now
            }
        });
        let ChatsSchema = mongoose.Schema({
            from: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            to: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            message: {
                type: String,
                required: true
            },
            status: {
                type: String,
                default: 'Unseen'
            },
            created: {
                type: Date,
                default: Date.now
            }
        });
        this.User = mongoose.model('User',UsersSchema);
        this.Chat = mongoose.model('Chat', ChatsSchema);
    }

    addUser(data) {
        let user =  new this.User({
            _id: new mongoose.Types.ObjectId(),
            name: data.name,
            email: data.email,
            username: data.username,
            password: data.password,
            dp: data.dp
        });
        return user.save();
    }
    
    fetchUserByUsername(username){
        return this.User.findOne({username: username}).lean();
    }
    fetchUserByToken(token){
        return this.User.findOne({_id: token}).lean();
    }
    fetchUsers(){
        return this.User.find({}).sort({name: 1}).lean();
    }

    async fetchMessages(from,to){
        const messages = await this.Chat.find({$or:[{from: from, to: to}, {from: to, to: from}]}).populate('from','name-_id username').populate('to','name-_id username'); 
        return messages;
    }

    async fetchUnseenMessages(from,to){
        const messages = await this.Chat.find({from: from, to: to, status: 'Unseen'}).populate('from','name-_id username').populate('to','name-_id username'); 
        return messages;
    }

    markSeen(from,to){
        this.Chat.updateMany({from: from, to: to, status: 'Unseen'},{status: 'Seen'}, (err, numAffected)=> {
            return numAffected;
        });
    }

    storeMessage(data) {
        let message = new this.Chat({
            _id: new mongoose.Types.ObjectId(),
            from: data.from.token,
            to: data.to,
            message: data.message
        });
        return message.save();
        console.log(data);
    }
}

module.exports = {
    server: Server
}