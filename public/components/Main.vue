<template>
    <div class="container clearfix" id="app">
      <span class="float-right logout-btn" @click.prevent="logout"><i class="fa fa-sign-out"></i> Logout</span>
      <span class="float-left me-name">
        <span class="name">{{me.name}}</span>
        <span class="email">{{me.email}}</span>
        <i>@{{me.username}}</i>
      </span>
      <span class="clearfix"></span>
    <div class="people-list" id="people-list">
      <div class="search">
        <input type="text" placeholder="search" v-model="search" v-on:keyup.enter="searchNames()" />
        <i class="fa fa-search"></i>
      </div>
      <ul class="list" v-if="users != null">
        <!-- Users-->
        <li class="clearfix" v-for="(user,index) in users" :key="index" @click.prevent="getMessages(user)" v-if="user.username != me.username">
          <span :class="`dp-wrds ${user.status}`">{{user.name.substr(0,2).toUpperCase()}}
            <span class="unseen" v-if="user.unseen > 0">{{user.unseen}}</span>
          </span>
          <div class="about">
            <div class="name">{{user.name}}</div>
            <small class="username"><i>@{{user.username}}</i></small>
            <div class="status">
                
            </div>
          </div>
        </li>
      </ul>
    </div>
    
    <div class="chat">
      <div class="chat-header clearfix" v-if="currUser">
        <span :class="`dp-wrds ${currUser.status}`">{{currUser.name.substr(0,2).toUpperCase()}}</span>
        
        <div class="chat-about" v-if="currUser != null">
          <div class="chat-with">{{currUser.name}}</div>
          <div class="chat-num-messages"><small v-if="typing">Typing...</small></div>
        </div>
        <i class="fa fa-star"></i>
      </div> <!-- end chat-header -->
      
      <div class="chat-history" v-if="currUser">
        <ul>
          <!-- Chat Messages -->
          <li v-for="(chat,index) in  chats" :key="index" :class="(chat.from.username == me.username) ? 'clearfix' : ''" v-if="securityChatCheck(chat)">
            <div :class="(chat.from.username == me.username) ? 'message-data align-right' : 'message-data'">
              <span class="message-data-name"><i class="fa fa-circle online"></i> {{(chat.from.username == me.username) ? 'You' : chat.from.name}}</span>
              <span class="message-data-time">{{fromNow(chat.created)}}</span>
            </div>
            <div :class="(chat.from.username == me.username) ? 'message other-message float-right' : 'message my-message'">
              {{chat.message}}
            </div>
          </li>

          <Chat :chats="chats" :securityChatCheck="securityChatCheck" :fromNow="fromNow" />
        </ul>
        
      </div> <!-- end chat-history -->
      
      <div class="chat-message clearfix" v-if="currUser">
        <textarea name="message-to-send" v-model="message" vlaue="" placeholder ="Type your message" rows="3" @focus="markSeen()"></textarea>
                
        <!-- <i class="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
        <i class="fa fa-file-image-o"></i> -->
        
        <button @click.prevent="sendMessage()">Send</button>

      </div> <!-- end chat-message -->
      
    </div> <!-- end chat -->
    
  </div> <!-- end container -->
</template>

<script>
import Chat from './Chat';
export default {
    components: {
        Chat
    }
}
</script>