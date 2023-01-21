import { io } from 'socket.io-client';

class SocketioService {
  socket : any;
  constructor() {}

  setupSocketConnection() {
    this.socket = io('localhost:3002', { withCredentials: true });
    if (this.socket)
      console.log('Socket connected');
 
    // console.log(this.socket);
    return (this.socket);
  }

  // sends a message to the server
  sendMessage(chatid : String, message : String) {
    console.log("Sending message");
    this.socket.emit('chat message', {chatid, message });
  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }

}

export default new SocketioService();