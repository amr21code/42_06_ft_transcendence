import { io } from 'socket.io-client';

class SocketioService {
  socket : any;
  messages : Array<String> | undefined;
  constructor() {}

  setupSocketConnection() {
    this.socket = io('localhost:3002', { withCredentials: true });
    if (this.socket)
      console.log('Socket connected: ', this.socket.id);
    // this.socket.on('chat-message', (data: any) => {
    //   console.log("chat-message received:", data);
    //   if (this.messages == undefined)
    //   {
    //     this.messages = new Array<String>();
    //     this.messages.push(data.message);
    //   }
    //   else
    //     this.messages.push(data.message);
    // });
  
    return (this.socket);
  }

  //returns the messages
  getMessages() {
    // console.log('getMessages', this.messages);  
    return this.messages;
  }

  // sends a message to the server
  sendMessage(userid : String, chatid : String, message : String) {
    console.log("Sending message");
    this.socket.emit('send-chat-message', {userid, chatid, message });
  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }

}

export default new SocketioService();