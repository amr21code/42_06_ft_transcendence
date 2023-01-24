import { io } from 'socket.io-client';

class SocketioService {
  socket : any;
  messages : Array<String> | undefined;
  constructor() {}

  setupSocketConnection() {
    this.socket = io('http://localhost:3002', { withCredentials: true });
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

  // sends a message to the server
  sendMessage(username: String, userid : String, chatid : number, message : String) {
    // console.log("Sending message", userid, chatid, message);
    this.socket.emit('send-chat-message', {username, userid, chatid, message });
  }

  chatLeave(chatid: number) {
    this.socket.emit('send-chat-leave', { chatid });
  }

  // new chat got created
  refreshChats() {
    // console.log("send signal for refresh");
    this.socket.emit('send-chat-refresh');
  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }

}

export default new SocketioService();