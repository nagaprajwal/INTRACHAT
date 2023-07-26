const socket=io();

const clienttotal=document.getElementById('client-total');

const messageContainer=document.getElementById('message-container');
const nameInput=document.getElementById('name-input');
const messageForm=document.getElementById('message-form');
const messageInput =document.getElementById('message-input');

const messageTone = new Audio('/message-tone.mp3')

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();  //to prevent from reloading
    sendmessage();
})

socket.on('clients-total', (data) => {
    clienttotal.innerText = `Total Clients: ${data}`
  })
  
function sendmessage(){
    // console.log(messageInput.value);

    if(messageInput.value==='')return 

    // create a json to send to Server;
    const data={
        name:nameInput.value,
        message : messageInput.value,
        dateTime:new Date()
    }
    // for sending message
    socket.emit('message',data)
    addMessageToUI(true,data);
    messageInput.value=''
}

socket.on('chat-message',(data)=>{
    // console.log(data)
    messageTone.play();
    addMessageToUI(false,data);
})

function addMessageToUI(isOwnMessage, data){
    clearFeedback();
    const element=`
    <li class="${isOwnMessage? "message-right":"message-left"}">
    <p class="message">
      ${data.message}
      <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
    </p>
  </li>`

  messageContainer.innerHTML+=element;
  scrollToBottom();
}

// to scrollto bottom
function scrollToBottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}

messageInput.addEventListener('focus',(e)=>{
socket.emit('feedback',{
    feedback:`${nameInput.value} is typing a message`,
})
})
messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value}is typing a message`,
    })
})
messageInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback:'',
    })
})

socket.on('feedback',(data)=>{
    clearFeedback()
    const element=`
    <li class="message-feedback">
    <p class="feedback" id="feedback">${data.feedback}</p>
  </li> `

  messageContainer.innerHTML+=element
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}



// to send event from client to server we use emit