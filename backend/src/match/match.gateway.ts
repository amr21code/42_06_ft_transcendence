import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MatchService } from './match.service';
import { createGameState, gameLoop, getUpdatedVelocity } from './match.engine';
import { MatchGameStateDto } from './dto/matchgamestate.dto';

//add namespace???

@WebSocketGateway(3002, {
	cors: {
		origin: ['http://192.168.56.2:5173', 'http://localhost:5173'],
		methods: ["GET", "POST"],
		credentials: true,
	}
})

export class MatchGateway {
	constructor(private readonly matchService: MatchService) { }

	@SubscribeMessage('message')
	handleMessage(client: any, payload: any): string {
		console.log(payload);
		return "test";
	}

	@SubscribeMessage('send-opponent-status')
	async refreshMatch(client: Socket, payload: any) {
		// const status = this.matchService.getOpponentStatus(payload.matchid, payload.userid);
		//client.emit('opponent-status', {data: status});
		client.emit('opponent-status', { data: true });
		// if clause for opponent-status === true hinzufügen!
		this.handleInit(client, payload);
	}

	@SubscribeMessage('init')
	async handleInit(client: any, canvas: any) {
		console.log(canvas);
		// console.log(JSON.parse(canvas));
		const gameState = await createGameState();

		// gameState.canvasHeight = canvas[0];
		// gameState.canvasWidth = canvas[1];
		gameState.canvasHeight = 503;
		gameState.canvasWidth = 839;
		gameState.paddleWidth = gameState.canvasWidth  / 25;
		gameState.paddleHeight = gameState.canvasHeight / 4;
		gameState.ballSize = gameState.canvasWidth  / 25;
		gameState.wallOffset = gameState.canvasWidth  / 25;
		gameState.player1.pos.x = gameState.wallOffset;
		gameState.player1.pos.y = gameState.canvasHeight / 2 - gameState.paddleHeight / 2;
		gameState.player2.pos.x = gameState.canvasWidth  - (gameState.wallOffset + gameState.paddleWidth);
		gameState.player2.pos.y = gameState.canvasHeight / 2 - gameState.paddleHeight / 2;
		gameState.ball.pos.x = gameState.canvasWidth  / 2 - gameState.ballSize / 2;
		gameState.ball.pos.y = gameState.canvasHeight / 2 - gameState.ballSize / 2;
		gameState.stepSize = 7;

		client.emit('gameState', gameState);
		client.on('keydown', handleKeyDown);

		function handleKeyDown(keyCode: any) { // inline to have access to 'socket'

			const keyInt = parseInt(keyCode); // maybe put in try/catch?
			const vel = getUpdatedVelocity(keyInt);
			if (vel === -1 && !(gameState.player1.pos.y <= 20)) {
				gameState.player1.y_vel = vel;
				gameState.player1.pos.y += vel * gameState.stepSize;
			}
			else if (vel == 1 && !(gameState.player1.pos.y + gameState.paddleHeight >= gameState.canvasHeight - 20)) {
				gameState.player1.y_vel = vel;
				gameState.player1.pos.y += vel * gameState.stepSize;
			}

			startGameInterval(client, gameState);
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
			}, 1000 / 10); //todo change to FRAME_RATE
		}
	}
}
