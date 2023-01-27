import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchService } from './match.service';
import { createGameState, gameLoop, getUpdatedVelocity } from './match.engine';
import { MatchGameStateDto } from './dto/matchgamestate.dto';
import { UserService } from 'src/user/user.service';
import { ConsoleLogger, Session } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

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

	
    handleConnection(client: Socket, room: string): any {
		client.on('room', function(room) {
			client.join(room);
        });
    }
	
	@WebSocketServer()
	server: Server

	constructor(private readonly matchService: MatchService) { }


	@SubscribeMessage('create-new-game')
	async createNewGame(client: Socket, payload: any) {
		const userid = client.request.session.passport.user.userid;
		const matchid = await this.matchService.listMatch(userid);
		// const matchid = await this.matchService.listActiveMatch(userid);
		const roomNumber = matchid[0].matchid;

		//-------------! NEW
		client.join(roomNumber);
		// client.number = 1;
		(client as any).number = 1; // Error umgangen
		client.emit('init', 1);
		//-------------! NEW


		console.log("room number for opponent status: ", roomNumber);
		const status = await this.matchService.getOpponentStatus(roomNumber, userid);
		
		console.log("CHECK_OPPONENT: opponent status is: ", status, " room numver is: ", roomNumber);

		this.clientRooms[client.id] = roomNumber;

		client.emit('opponent-status', {data: status, matchid: roomNumber}); //! NEW
		//client.emit('opponent-status', { data: true });
		// if clause for opponent-status === true hinzufügen!
	}


	@SubscribeMessage('joinGame')
	async joinGame(client: any, canvas: any) {
		console.log("JOINED GAME");
		// !!!!! USE MATCHID FROM CLIENTROOMS
		const userid = client.request.session.passport.user.userid;
		// const matchid = await this.matchService.listActiveMatch(userid);
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
		
		// NEW
		// const cur_room = this.server.in(roomNumber).emit
		const cur_room = this.server.sockets.adapter.rooms[roomNumber];
		
		let allUsers;
		if (cur_room) {
			allUsers = cur_room.sockets;
		}

		let numClients = 0;
		if (allUsers) {
			numClients = Object.keys(allUsers).length;
		}

		if (numClients === 0) {
			client.emit('joinedEmptyGame');
			return;
		}
		else if (numClients > 1) {
			client.emit('tooManyPlayers');
			return;
		}

		this.clientRooms[client.id] = roomNumber;
		client.join(roomNumber);
		(client as any).number = 2; 
		client.emit('init', 2);

		// NEW


		
		client.emit('gameState', JSON.stringify(MatchGateway[roomNumber]));
		client.on('keydown', handleKeyDown);
		// startGameInterval(client, MatchGateway[roomNumber]); // old
		startGameInterval(roomNumber);


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

		function startGameInterval(roomNumber: number) {
			const intervalId = setInterval(() => {
				const winner = gameLoop(MatchGateway[roomNumber]);
				if (!winner) {
					// sends new state to all room members
					this.server.in(roomNumber).emit('gameState', JSON.stringify(MatchGateway[roomNumber]));
				}
				else {
					// sends game over to all room members
					this.server.in(roomNumber).emit('gameOver', JSON.stringify(MatchGateway[roomNumber]));
					MatchGateway[roomNumber] = null;
					clearInterval(intervalId); // was macht das?
				}
			}, 1000 / 30); // argument determines frames per ssecond
		}
	}
}
