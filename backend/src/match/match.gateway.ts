import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { MatchService } from './match.service';
import { MatchEngine } from './match.engine';

@WebSocketGateway(3002, { cors: {
	origin: ['http://192.168.56.2:5173','http://localhost:5173'],
	methods: ["GET", "POST"],
	credentials: true,
}
})
export class MatchGateway {
  constructor(private readonly matchEngine: MatchEngine, private readonly matchService: MatchService) {
	}

  	@SubscribeMessage('message')
  	handleMessage(client: any, payload: any): string {
    	console.log(payload);
		return "test";
  }

  @SubscribeMessage('send-opponent-status')
	async refreshMatch(client: Socket, payload: any) {
    // const status = this.matchService.getOpponentStatus(payload.matchid, payload.userid);
	//client.emit('opponent-status', {data: status});
    client.emit('opponent-status', {data: true});
	}
	
	async handleConnection(client: any) {
		const state = await this.matchEngine.createGameState();
		client.emit('gameState', state);
		client.on('keydown', handleKeyDown);
		
		function handleKeyDown(keyCode: any) { // inline to have access to 'socket'
		
		const keyInt = parseInt(keyCode); // maybe put in try/catch?
		const vel = this.matchEngine.getUpdatedVelocity(keyInt);
		if (vel) {
			state.player1.y_vel = vel;	
		}
	
		startGameInterval(client, state);
	}
	function startGameInterval(client: any, state: any) {
		const intervalId = setInterval(() => {
			const winner = this.matchEngine.gameLoop(state);
			if (!winner) {
				client.emit('gameState', JSON.stringify(state));
			}
			else {
				client.emit('gameOver');
				clearInterval(intervalId);
			}
		}, 1000 / 30); //todo change to FRAME_RATE
	}
	}
}
