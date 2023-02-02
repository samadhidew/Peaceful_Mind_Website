<template>
    <div>
    <li v-for="(chat,index) in  chats" :key="index" :class="(chat.from.username == me.username) ? 'clearfix' : ''" v-if="securityChatCheck(chat)">
        <div :class="(chat.from.username == me.username) ? 'message-data align-right' : 'message-data'">
            <span class="message-data-name"><i class="fa fa-circle online"></i> {{(chat.from.username == me.username) ? 'You' : chat.from.name}}</span>
            <span class="message-data-time">{{fromNow(chat.created)}}</span>
        </div>
        <div :class="(chat.from.username == me.username) ? 'message other-message float-right' : 'message my-message'">
            {{chat.message}}
        </div>
    </li>
    </div>
</template>
<script>
export default {
    props: ['chats', 'securityChatCheck', 'fromNow'],
    data() {
        return {

        }
    },
    mounted() {

    },
    methods: {

    }
}
</script>