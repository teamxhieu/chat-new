$(function() {
    $(".heading-compose").click(function() {
        $(".side-two").css({
            "left": "0"
        });
    });

    $(".newMessage-back").click(function() {
        $(".side-two").css({
            "left": "-100%"
        });
    });
})

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
// const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    // outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    console.log(message.username)
    if (message.username != username) {
        $html = `<div class="row message-body">
                    <div class="col-sm-12 message-main-receiver">
                    <div class="message-data text-left"> <span class="message-data-time">${message.username}</span> </div>
                        <div class="receiver">
                            <div class="message-text">
                                ${message.text}
                            </div>
                            <span class="message-time pull-right">${message.time}</span>
                        </div>
                    </div>
                </div>`
    } else {
        $html = `<div class="row message-body">
                    <div class="col-sm-12 message-main-sender">
                    <div class="message-data text-right"> <span class="message-data-time">${message.username}</span> </div>
                        <div class="sender">
                            <div class="message-text">
                                ${message.text}
                            </div>
                            <span class="message-time pull-right">${message.time}</span>
                        </div>
                    </div>
                </div>`
    }
    $("div[id=conversation]").append($html)
}

// Add room name to DOM
// function outputRoomName(room) {
//     roomName.innerText = room;
// }

// Add users to DOM
function outputUsers(users) {
    $html_1 = ''
    users.forEach((user) => {
        $html_1 += `<div class="row sideBar-body">
            <div class="col-sm-3 col-xs-3 sideBar-avatar">
                <div class="avatar-icon">
                    <img src="https://bootdey.com/img/Content/avatar/avatar${Math.floor(Math.random() * 5) + 1}.png">
                </div>
            </div>
            <div class="col-sm-9 col-xs-9 sideBar-main">
                <div class="row">
                    <div class="">
                        <span class="name">${user.username}</span>
                        <div class="status"> <i class="fa fa-circle online"></i> online </div>
                    </div>
                </div>
            </div>
        </div>`
        $('div[id=users]').html($html_1);
    });
}

document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Bạn có chắc chắn muốn rời khỏi phòng trò chuyện không?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {}
});