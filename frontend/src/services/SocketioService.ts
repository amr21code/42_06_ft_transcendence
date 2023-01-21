import { io } from 'socket.io-client';

class SocketioService {
  socket : any;
  constructor() {}

  setupSocketConnection() {
    this.socket = io('localhost:3002', { withCredentials: true });
    console.log('Socket connected');

    this.socket.on('chat message', (message : String) => {
      this.socket.emit('chat message', message);
      console.log(message);
    });
    console.log(this.socket);
    return (this.socket);
  }

  // send a message to the server
  sendMessage(chatid : String, message : String) {
    console.log("Sending message");
    this.socket.emit('chat message', {chatid, message });  //this.socket is undefined
  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }
}

export default new SocketioService();