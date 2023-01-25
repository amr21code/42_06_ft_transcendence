import { io } from 'socket.io-client';

class SocketioService {
  socket : any;
  messages : Array<String> | undefined;
  constructor() {}

  // sets up the connection
  setupSocketConnection() {
    this.socket = io(import.meta.env.VITE_SOCKETIO_URL, { withCredentials: true });
    if (this.socket)
      console.log('Socket connected: ', this.socket.id);
  
    return (this.socket);
  }

  // sends a message to the server
  sendMessage(username: String, userid : String, chatid : number, message : String) {
    console.log('SocketIO sendMessage');
    this.socket.emit('send-chat-message', {username, userid, chatid, message });
  }

  // sends a signal that the user left the chat
  chatLeave(chatid: number) {
    this.socket.emit('send-chat-leave', { chatid });
  }

  // sends a signal that the chats need to get refreshed
  refreshChats() {
    this.socket.emit('send-chat-refresh');
  }

  // user disconnected
  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }

}

export default new SocketioService();