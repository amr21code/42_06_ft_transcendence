import { io } from 'socket.io-client';

class SocketioService {
  socket : any;
  messages : Array<String> | undefined;
  constructor() {}

  // sets up the connection
  setupSocketConnection() {
    this.socket = io(import.meta.env.VITE_SOCKETIO_URL, { withCredentials: true });
    if (this.socket != undefined)
      console.log('Socket connected: ', this.socket.id);
  
    return (this.socket);
  }

  // sends a message to the server
  sendMessage(username: String, userid : String, chatid : number, message : String) {
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

  //----------GAME STUFF----------------------
  getOpponentStatus(canvas: any) {
	this.socket.emit('send-opponent-status', canvas);
  }


  //----------GAME STUFF END----------------------

}

export default new SocketioService();