import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchService } from './match.service';
import { createGameState, gameLoop, getUpdatedVelocity } from './match.engine';
import { MatchGameStateDto } from './dto/matchgamestate.dto';
import { UserService } from 'src/user/user.service';
import { state } from 'pactum';

@WebSocketGateway(3002, {
	cors: {
		origin: `${process.env.FRONTEND_URL}`,
		methods: ["GET", "POST"],
		credentials: true,
	}
})

export class MatchGateway {

	@WebSocketServer()
	public server: Server;
	public static states: MatchGameStateDto[] = [];

	handleConnection(client: Socket, room: string): any {
		client.on('room', function (room) {
			client.join(room);
		});
	}


	constructor(private readonly matchService: MatchService, private readonly userService: UserService) { }


	@SubscribeMessage('create-new-game')
	async createNewGame(client: Socket, opponent: any) {
		var matchid;
		console.log("crete game opp", opponent);
		const userid = client.request.session.passport.user.userid;
		if (!opponent)
			matchid = await this.matchService.matchmaking(userid);
		else if (opponent === userid) {
			matchid = await this.matchService.listMatch(userid);
			await this.matchService.acceptMatch(userid);
			// matchid = await this.matchService.join(userid, matchid[0].matchid);
		} else
			matchid = await this.matchService.openMatch(userid, 1, opponent);
		// const matchid = await this.matchService.listMatch(userid);
		console.log("matchid ",matchid);
		const roomNumber = matchid[0].matchid;

		if (!this.server.sockets.adapter.rooms.has(roomNumber)) {
			client.join(roomNumber);
			MatchGateway[roomNumber] = await createGameState();
			MatchGateway[roomNumber].player1.userid = userid;
			// client.number = 1;
			(client as any).number = 1;
			client.emit('init', 1);
		} else {
			MatchGateway[roomNumber].player2.userid = userid;
		}

		// console.log("room number for opponent status: ", roomNumber);
		const status = await this.matchService.getOpponentStatus(roomNumber, userid);

		console.log("CHECK_OPPONENT: opponent status is: ", status, " room number is: ", roomNumber);

		client.emit('opponent-status', { data: status, matchid: roomNumber });
		//client.emit('opponent-status', { data: true });
		// if clause for opponent-status === true hinzufügen!
	}

	@SubscribeMessage('startGame')
	async startGame(client: Socket, canvasData: number)
	{
		console.log("start Game")
		const userid = client.request.session.passport.user.userid;
		const matchid = await this.matchService.listMatch(userid);
		const roomNumber = matchid[0].matchid;
		console.log("Users");
		console.log(MatchGateway[roomNumber].player1.userid);
		console.log(MatchGateway[roomNumber].player2.userid);
		// MatchGateway[roomNumber].canvasHeight = canvasData[0];
		// MatchGateway[roomNumber].canvasWidth = canvasData[1];
		MatchGateway[roomNumber].canvasHeight = 120;
		MatchGateway[roomNumber].canvasWidth = 200;
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
		MatchGateway[roomNumber].paddleSpeed = MatchGateway[roomNumber].canvasHeight / 75;
		MatchGateway[roomNumber].ballSpeed = MatchGateway[roomNumber].canvasHeight / 75;
		// console.log("canvas height: ", canvasData[0], " ballSpeed: " ,MatchGateway[roomNumber].ballSpeed)
		var randomDirection = Math.floor(Math.random() * 2) + 1;
		if (randomDirection % 2) {
			MatchGateway[roomNumber].ball.vel.x = 1;
		} else {
			MatchGateway[roomNumber].ball.vel.x = -1;
		}
		MatchGateway[roomNumber].ball.vel.y = 1;



		const cur_room = this.server.sockets.adapter.rooms.get(roomNumber);
		// console.log("#CUR ROOM is: ", this.server.sockets.adapter.rooms.get(roomNumber));

		let numClients = 0;
		if (cur_room) {
			numClients = cur_room.size;
			// console.log("num clients is: ", numClients);
		}

		if (numClients === 0) {
			client.emit('joinedEmptyGame');
			return;
		}
		else if (numClients > 1) {
			client.emit('tooManyPlayers');
			return;
		}
		//if (client.number != 1)
		//{
			client.join(roomNumber);
			(client as any).number = 2;
			client.emit('init', 2);
		//}
		this.server.to(roomNumber).emit('joinGame', MatchGateway[roomNumber], roomNumber);
		this.startGameInterval(roomNumber, client);
	}

	@SubscribeMessage('joinGame')
	async joinGame(client: any, gameState: any) {
		console.log("JOINED GAME");
		//if (!MatchGateway[roomNumber])
		const roomNumber = gameState[1];
		MatchGateway[roomNumber] = gameState[0];

		
		console.log(MatchGateway[roomNumber]);

		client.emit('gameState', JSON.stringify(MatchGateway[roomNumber]));
		client.on('keydown', handleKeyDown);
		// this.startGameInterval(roomNumber, client);


		// ############################# FUNCTION DECLARATIONS ####################################################

		function handleKeyDown(keyCode: any) {

			const keyInt = parseInt(keyCode); // maybe put in try/catch?
			const vel = getUpdatedVelocity(keyInt);
			// console.log("key down:" ,client.number);
			if (client.number === 1) {
				if (vel) {
					MatchGateway[roomNumber].player1.y_vel = vel;
				}
				else {
					MatchGateway[roomNumber].player1.y_vel = 0;
				}
			}
			else if (client.number === 2) {
				if (vel) {
					MatchGateway[roomNumber].player2.y_vel = vel;
				}
				else {
					MatchGateway[roomNumber].player2.y_vel = 0;
				}
			}
		}
	}

	async startGameInterval(roomNumber: any, client: any) {
		const intervalId = setInterval(() => {
			const winner = gameLoop(MatchGateway[roomNumber]);
			if (!winner) {
				// sends new state to all room members
				this.server.to(roomNumber).emit('gameState', JSON.stringify(MatchGateway[roomNumber]));
			} else {
				// sends game over to all room members
				this.server.to(roomNumber).emit('gameOver', JSON.stringify(MatchGateway[roomNumber]));
				this.matchService.updateMatch(roomNumber, MatchGateway[roomNumber]);
				// MatchGateway[roomNumber] = null;
				clearInterval(intervalId); // was macht das?
			}
		}, 1000 / 30); // argument determines frames per ssecond
	}

	@SubscribeMessage('sendChallengeRequest') 
	async sendChallengeRequest(client: any, data: any) {	
		const opponentid = await this.userService.getUserData(data, 'socket_token');
		// console.log("OPPONENTID IS: ", opponentid[0].socket_token);
		if (opponentid[0])
			this.server.to(opponentid[0].socket_token).emit('challengeRequest', client.request.session.passport.user.userid);
	}
}
