import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchService } from './match.service';
import { createGameState, gameLoop, getUpdatedVelocity } from './match.engine';
import { MatchGameStateDto } from './dto/matchgamestate.dto';

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


	constructor(private readonly matchService: MatchService) { }


	@SubscribeMessage('create-new-game')
	async createNewGame(client: Socket, payload: any) {
		const userid = client.request.session.passport.user.userid;
		const matchid = await this.matchService.listMatch(userid);
		const roomNumber = matchid[0].matchid;

		if (!this.server.sockets.adapter.rooms.has(roomNumber)) {

			client.join(roomNumber);
			// client.number = 1;
			(client as any).number = 1;
			client.emit('init', 1);
		}

		console.log("room number for opponent status: ", roomNumber);
		const status = await this.matchService.getOpponentStatus(roomNumber, userid);

		console.log("CHECK_OPPONENT: opponent status is: ", status, " room numver is: ", roomNumber);

		client.emit('opponent-status', { data: status, matchid: roomNumber });
		//client.emit('opponent-status', { data: true });
		// if clause for opponent-status === true hinzufügen!
	}


	@SubscribeMessage('joinGame')
	async joinGame(client: any, canvas: any) {
		console.log("JOINED GAME");
		const userid = client.request.session.passport.user.userid;
		const matchid = await this.matchService.listMatch(userid);
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



		const cur_room = this.server.sockets.adapter.rooms.get(roomNumber);
		console.log("#CUR ROOM is: ", this.server.sockets.adapter.rooms.get(roomNumber));

		let numClients = 0;
		if (cur_room) {
			numClients = cur_room.size;
			console.log("num clients is: ", numClients);
		}

		if (numClients === 0) {
			client.emit('joinedEmptyGame');
			return;
		}
		else if (numClients > 1) {
			client.emit('tooManyPlayers');
			return;
		}

		client.join(roomNumber);
		(client as any).number = 2;
		client.emit('init', 2);

		client.emit('gameState', JSON.stringify(MatchGateway[roomNumber]));
		client.on('keydown', handleKeyDown);
		this.startGameInterval(roomNumber, client);


		// ############################# FUNCTION DECLARATIONS ####################################################

		function handleKeyDown(keyCode: any) {

			const keyInt = parseInt(keyCode); // maybe put in try/catch?
			const vel = getUpdatedVelocity(keyInt);
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
			}
			else {
				// sends game over to all room members
				this.server.to(roomNumber).emit('gameOver', JSON.stringify(MatchGateway[roomNumber]));
				MatchGateway[roomNumber] = null;
				clearInterval(intervalId); // was macht das?
			}
		}, 1000 / 30); // argument determines frames per ssecond
	}
}
