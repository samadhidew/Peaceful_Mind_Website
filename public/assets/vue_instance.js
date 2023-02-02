var server = "http://localhost:3000";
var io = io(server);

var app = new Vue({
    el: "#app",
    data:{
        apiUrl: 'http://localhost:3000',
        authStatus: false,
        token: $.cookie('token'),
        me: {},
        users: null,
        currUser: null,
        chats: null,
        message: null,
        typing: false,
        search: null,
    },
    watch: {
        message(value) {
        value ? io.emit('typing', {user: this.currUser.username, from: this.me.username}) : io.emit('stop-typing', {user: this.currUser.username, from: this.me.username});
        },
        search(value) {
            if(!value){
                this.fetchUsers();
            }
        }
    },
    mounted() {
    this.checkAuth();
    setTimeout(()=> {
        if(!this.authStatus){
        window.location.href = '/login';
        }
    },500);
    this.sockInits();    
    },
    methods: {
    sockInits(){
        this.fetchUsers();
        io.emit('make-online',{token: this.token});
        io.on('make-online',(data)=> {
            this.changeUserStatus(data.user,'online');
        });
        io.on('make-offline',(data)=> {
            this.changeUserStatus(data.user,'offline');
        });
        io.on('get-users',(data)=> {
            this.users = data;
        });
        io.on('get-messages',(data)=> {
            this.chats = data;
            setTimeout(()=>{
            let scrollOffset = $('.chat-history')[0].scrollHeight + 40;
            $('.chat-history').scrollTop(scrollOffset);
            },100);
        });
        io.on('send-message', (data)=> {
            let user = this.users.find((usr)=> {
            return usr.username == data.from.username;
            });
            let index = this.users.indexOf(user);
            this.users[index]['unseen'] = parseInt(this.users[index]['unseen']) + 1; 
            if(this.chats){
            this.chats.push(data);
            let scrollOffset = $('.chat-history')[0].scrollHeight + 40;
            $('.chat-history').scrollTop(scrollOffset);
            }
        });
        io.on('typing', (data)=> {
            if(this.currUser && (data.from == this.currUser.username)){
                this.typing = data.status;
            }else{
            this.typing = null;
            } 
        });
        io.on('stop-typing', (data)=> {
            this.typing = data.status;
        });
        io.on('mark-seen', (data)=> {
            let user = this.users.find((usr)=> {
                return usr.username == data.from;
            });
            let index = this.users.indexOf(user);
            this.users[index]['unseen'] = 0;
        });
    },
    checkAuth(){
        if($.cookie('token') != 'null'){
            const options = {
                method: 'GET',
                headers: {'content-type': 'application/json'},
                url: `${this.apiUrl}/check-auth/${$.cookie('token')}`
            };
            axios(options).then((data)=> {
                if(data.data.message == 'Authentic'){
                    this.me = data.data.user;
                    this.authStatus = true;
                }else{
                    this.authStatus = false;
                }
            }).catch((err)=> {
                if(err.response.data.message == 'Unauthorised'){
                    this.authStatus = false;
                }
            })      
        }
    },
    fetchUsers() {
        io.emit('get-users',{token: this.token});
    },
    getMessages(user) {
        this.currUser = user;
        this.typing = false;
        io.emit('get-messages', {token: this.token, to: user.username});
        this.markSeen();
    },
    sendMessage() {
        let time = moment();
        let chat = {
            from: {
                token: $.cookie('token'),
                name: this.me.name,
                username: this.me.username
            },
            to: this.currUser.username,
            message: this.message,
            created: time 
        };
        this.chats.push(chat);
        io.emit('send-message', chat);
        let scrollOffset = $('.chat-history')[0].scrollHeight + 40;
        $('.chat-history').scrollTop(scrollOffset);
        this.message = null;
    },
    logout() {
        $.cookie('token', null, {path: '/'});
        window.location.href = '/login';
    },
    fromNow(date){
        return moment(date).fromNow();
    },
    changeUserStatus(username,status){
        let user = this.users.find((user)=> {
            return user.username == username;
        });
        let index = this.users.indexOf(user);
        this.users[index].status = status;
    },
    markSeen() {
        io.emit('mark-seen', {from: this.currUser.username, to: this.token});
    },
    securityChatCheck(chat) {
        return (chat.from.username == this.currUser.username) || (chat.from.username == this.me.username); 
    },
    searchByName(name){
        let users = this.users.find((user)=> {
            return user.name.search(name) > -1;
        });
        
        return users;
    },
    searchNames(){
        let usAr = [];
        let peopleList = $('div.people-list li');
        peopleList.each((index, item)=> {
            let name = item.childNodes[2].childNodes[0].innerText;
            if(name.search(this.search) > -1){ 
                let users = this.searchByName(name);
                usAr.push(users);
            }
        });
        this.users = usAr;
    }
    
    }
            
});