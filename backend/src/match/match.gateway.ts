import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MatchService } from './match.service';
import { createGameState, gameLoop, getUpdatedVelocity } from './match.engine';
import { MatchGameStateDto } from './dto/matchgamestate.dto';
import { UserService } from 'src/user/user.service';
import { Session } from '@nestjs/common';

//add namespace???

@WebSocketGateway(3002, {
	cors: {
		origin: ['http://192.168.56.2:5173', 'http://localhost:5173'],
		methods: ["GET", "POST"],
		credentials: true,
	}
})

export class MatchGateway {
	constructor(private readonly matchService: MatchService, private readonly userService: UserService) { }

	@SubscribeMessage('message')
	handleMessage(client: any, payload: any): string {
		console.log(payload);
		return "test";
	}

	@SubscribeMessage('send-opponent-status')
	async refreshMatch(client: Socket, payload: any) {
		//const userid = this.userService.getMe().userid;
		//const matchid = this.matchService.listActiveMatch(userid);
		// const status = this.matchService.getOpponentStatus(matchid, userid);
		//client.emit('opponent-status', {data: status});
		client.emit('opponent-status', { data: true });
		// if clause for opponent-status === true hinzufügen!
		this.handleInit(client, payload);
	}

	//@SubscribeMessage('gameOver')
	//async gameOver(client: Socket, state: MatchGameStateDto, @Session() session: Record<string, any>){
	//	const userid = session.passport.user.userid;
	//	const matchid = this.matchService.listActiveMatch(userid);
	//	this.matchService.updateMatch(matchid, userid, state.scorePlayer1); //how do I know if I'm Player1 or Player2
	//}
	
	@SubscribeMessage('init')
	async handleInit(client: any, canvas: any) {
		console.log("called once");
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
		gameState.paddleSpeed = 3;
		gameState.ballSpeed = 6;
		// DETERMINE BALL KICKOFF DIRECTION
		var randomDirection = Math.floor(Math.random() * 2) + 1; 
		if (randomDirection % 2) {
			gameState.ball.vel.x = 1;
		} else {
			gameState.ball.vel.x = -1;
		}
		// gameState.ball.vel.x = -1;
		gameState.ball.vel.y = 1;


		client.emit('gameState', JSON.stringify(gameState));
		client.on('keydown', handleKeyDown);

		function handleKeyDown(keyCode: any) { // inline to have access to 'socket'

			const keyInt = parseInt(keyCode); // maybe put in try/catch?
			const vel = getUpdatedVelocity(keyInt);
			if (vel) {
				gameState.player1.y_vel = vel;
			}
			else {
				gameState.player1.y_vel = 0;
			}
		}
		startGameInterval(client, gameState);

		function startGameInterval(client: any, state: MatchGameStateDto) {
			const intervalId = setInterval(() => {
				const winner = gameLoop(state);
				if (!winner) {
					client.emit('gameState', JSON.stringify(state));
					// console.log(state);
				}
				else {
					client.emit('gameOver', JSON.stringify(state));
					//const userid = this.userService.getMe().userid;
					//const matchid = this.matchService.listActiveMatch(userid);
					//this.matchService.updateMatch(matchid, userid, state.scorePlayer1); //how do I know if I'm Player1 or Player2

					clearInterval(intervalId); // was macht das?
				}
			}, 1000 / 30); //todo change to FRAME_RATE
		}
	}
}
