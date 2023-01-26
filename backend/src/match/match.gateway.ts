import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MatchService } from './match.service';
import { createGameState, gameLoop, getUpdatedVelocity } from './match.engine';
import { MatchGameStateDto } from './dto/matchgamestate.dto';
import { UserService } from 'src/user/user.service';
import { ConsoleLogger, Session } from '@nestjs/common';

@WebSocketGateway(3002, {
	cors: {
		origin: `${process.env.FRONTEND_URL}`,
		// origin: ['http://192.168.56.2:5173', 'http://localhost:5173'],
		methods: ["GET", "POST"],
		credentials: true,
	}
})

export class MatchGateway {

	public clientRooms: number[] = [];
	public static states: MatchGameStateDto[] = [];


	constructor(private readonly matchService: MatchService) { }


	@SubscribeMessage('create-new-game')
	async createNewGame(client: Socket, payload: any) {
		const userid = client.request.session.passport.user.userid;
		const matchid = await this.matchService.listActiveMatch(userid);
		const roomNumber = matchid[0].matchid;
		const status = await this.matchService.getOpponentStatus(roomNumber, userid);
		
		console.log("CHECK_OPPONENT: opponent status is: ", status);

		this.clientRooms[client.id] = roomNumber;

		 client.emit('opponent-status', {data: status});
		//client.emit('opponent-status', { data: true });
		// if clause for opponent-status === true hinzufügen!
	}


	@SubscribeMessage('joinGame')
	async joinGame(client: any, canvas: any) {
		const userid = client.request.session.passport.user.userid;
		const matchid = await this.matchService.listActiveMatch(userid);
		const roomNumber = matchid[0].matchid;

		MatchGateway[roomNumber] = await createGameState();
		MatchGateway[roomNumber].canvasHeight = 503;
		MatchGateway[roomNumber].canvasWidth = 839;
		MatchGateway[roomNumber].paddleWidth = MatchGateway[roomNumber].canvasWidth / 25;
		MatchGateway[roomNumber].paddleHeight = MatchGateway[roomNumber].canvasHeight / 4;
		MatchGateway[roomNumber].ballSize = MatchGateway[roomNumber].canvasWidth / 25;
		MatchGateway[roomNumber].wallOffset = MatchGateway[roomNumber].canvasWidth / 25;
		MatchGateway[roomNumber].player1.pos.x = MatchGateway[roomNumber].wallOffset;
		MatchGateway[roomNumber].player1.pos.y = MatchGateway[roomNumber].canvasHeight / 2 - MatchGateway[roomNumber].paddleHeight / 2;
		MatchGateway[roomNumber].player2.pos.x = MatchGateway[roomNumber].canvasWidth - (MatchGateway[roomNumber].wallOffset + MatchGateway[roomNumber].paddleWidth);
		MatchGateway[roomNumber].player2.pos.y = MatchGateway[roomNumber].canvasHeight / 2 - MatchGateway[roomNumber].paddleHeight / 2;
		MatchGateway[roomNumber].ball.pos.x = MatchGateway[roomNumber].canvasWidth / 2 - MatchGateway[roomNumber].ballSize / 2;
		MatchGateway[roomNumber].ball.pos.y = MatchGateway[roomNumber].canvasHeight / 2 - MatchGateway[roomNumber].ballSize / 2;
		MatchGateway[roomNumber].paddleSpeed = 3;
		MatchGateway[roomNumber].ballSpeed = 6;
		
		// RANDOM BALL KICKOFF DIRECTION
		var randomDirection = Math.floor(Math.random() * 2) + 1;
		if (randomDirection % 2) {
			MatchGateway[roomNumber].ball.vel.x = 1;
		} else {
			MatchGateway[roomNumber].ball.vel.x = -1;
		}
		MatchGateway[roomNumber].ball.vel.y = 1;
		
		
		
		client.emit('gameState', JSON.stringify(MatchGateway[roomNumber]));
		client.on('keydown', handleKeyDown);
		startGameInterval(client, MatchGateway[roomNumber]);


		// ############################# FUNCTION DECLARATIONS ####################################################

		function handleKeyDown(keyCode: any) {

			const keyInt = parseInt(keyCode); // maybe put in try/catch?
			const vel = getUpdatedVelocity(keyInt);
			if (vel) {
				MatchGateway[roomNumber].player1.y_vel = vel;
			}
			else {
				MatchGateway[roomNumber].player1.y_vel = 0;
			}
		}

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
			}, 1000 / 30); // argument determines frames per ssecond
		}
	}
}
