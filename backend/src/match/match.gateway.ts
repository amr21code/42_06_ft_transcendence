import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MatchService } from './match.service';
import { createGameState, gameLoop, getUpdatedVelocity  } from './match.engine';
import { MatchGameStateDto } from './dto/matchgamestate.dto';

//add namespace???

@WebSocketGateway(3002, { cors: {
	origin: ['http://192.168.56.2:5173','http://localhost:5173'],
	methods: ["GET", "POST"],
	credentials: true,
}
})
export class MatchGateway {
  constructor( private readonly matchService: MatchService) {}

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
		const state = await createGameState();
		client.emit('gameState', state);
		client.on('keydown', handleKeyDown);
		
		function handleKeyDown(keyCode: any) { // inline to have access to 'socket'
		
			const keyInt = parseInt(keyCode); // maybe put in try/catch?
			const vel = getUpdatedVelocity(keyInt);
			if (vel) {
				state.player1.y_vel = vel;	
				state.player1.pos.y +=vel;
			}
			startGameInterval(client, state);
		}
		function startGameInterval(client: any, state: MatchGameStateDto) {
			const intervalId = setInterval(() => {
				const winner = gameLoop(state);
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
