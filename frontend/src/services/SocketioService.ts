import { io } from 'socket.io-client';

class SocketioService {
  socket : any;
  constructor() {}

  setupSocketConnection() {
    this.socket = io('http://192.168.56.2:3002');
    this.socket.emit('my message', 'Hello there from Vue.');

    this.socket.on('my broadcast', (data : String) => {
      console.log(data);
    });
  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }
}

export default new SocketioService();