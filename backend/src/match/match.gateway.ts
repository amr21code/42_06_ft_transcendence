import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchService } from './match.service';
import { createGameState, gameLoop, getUpdatedVelocity } from './match.engine';
import { MatchGameStateDto } from './dto/matchgamestate.dto';
import { UserService } from 'src/user/user.service';
import { AchievementsService } from 'src/achievements/achievements.service';
import { TwoFactorAuthenticationService } from 'src/auth/twoFactorAuth.service';

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


	constructor(private readonly matchService: MatchService, private readonly userService: UserService,  private readonly achieve: AchievementsService, private readonly twoFAService: TwoFactorAuthenticationService) { }

	@SubscribeMessage('watchGame')
	async watchGame(client: Socket, payload: any) {
		try {
			if (!this.twoFAService.socketIO2fa(client))
				throw new WsException('no 2fa authenticated');
			if (!payload) {
				var random = await this.matchService.listMatchesStatus(1);
				if (Object.keys(random).length > 0)
					payload = random[0].matchid;
				else
					throw new WsException('no game active');
			}
			console.log("watchgame", payload);
			client.join(payload);
			await this.matchService.joinWatch(client.request.session.passport.user.userid, payload);
		} catch (error) {
			client.emit('watchGame', 'failed');
			throw new WsException('watch game failed');
		}
	}

	@SubscribeMessage('create-new-game')
	async createNewGame(client: Socket, opponent: any) {
		try {
			if (!this.twoFAService.socketIO2fa(client))
				throw new WsException('no 2fa authenticated');
			var matchid;
			console.log("create game opp", opponent);
			const userid = client.request.session.passport.user.userid;
			if (!opponent)
				matchid = await this.matchService.matchmaking(userid);
			else if (opponent === userid) {
				matchid = await this.matchService.listMatch(userid);
				await this.matchService.acceptMatch(userid);
			} else
				matchid = await this.matchService.openMatch(userid, 1, opponent);
			console.log("matchid ",matchid);
			const roomNumber = matchid[0].matchid;

			if (!this.server.sockets.adapter.rooms.has(roomNumber)) {
				client.join(roomNumber);
				MatchGateway[roomNumber] = await createGameState();
				MatchGateway[roomNumber].player1.userid = userid;
				(client as any).number = 1;
				client.emit('init', 1);
				await this.userService.changeUserData(userid, "user_status", 3);
			} else {
				MatchGateway[roomNumber].player2.userid = userid;
				await this.userService.changeUserData(userid, "user_status", 2);
				await this.userService.changeUserData(MatchGateway[roomNumber].player1.userid, "user_status", 2);
			}

			const status = await this.matchService.getOpponentStatus(roomNumber, userid);

			console.log("CHECK_OPPONENT: opponent status is: ", status, " room number is: ", roomNumber);

			client.emit('opponent-status', { data: status, matchid: roomNumber });
		} catch (error) {
			throw new WsException('create game failed');
		}
	}

	@SubscribeMessage('startGame')
	async startGame(client: Socket, canvasData: number)
	{
		try {
			if (!this.twoFAService.socketIO2fa(client))
				throw new WsException('no 2fa authenticated');
			console.log("start Game")
			const userid = client.request.session.passport.user.userid;
			const matchid = await this.matchService.listMatch(userid);
			const roomNumber = matchid[0].matchid;
			console.log("Users");
			console.log(MatchGateway[roomNumber].player1.userid);
			console.log(MatchGateway[roomNumber].player2.userid);
			MatchGateway[roomNumber].canvasHeight = 120;
			MatchGateway[roomNumber].canvasWidth = 200;
			MatchGateway[roomNumber].paddleWidth = MatchGateway[roomNumber].canvasWidth / 50;
			MatchGateway[roomNumber].paddleHeight = MatchGateway[roomNumber].canvasHeight / 6;
			MatchGateway[roomNumber].ballSize = MatchGateway[roomNumber].canvasWidth / 50;
			MatchGateway[roomNumber].wallOffset = MatchGateway[roomNumber].canvasWidth / 50;
			MatchGateway[roomNumber].player1.pos.x = MatchGateway[roomNumber].wallOffset;
			MatchGateway[roomNumber].player1.pos.y = MatchGateway[roomNumber].canvasHeight / 2 - MatchGateway[roomNumber].paddleHeight / 2;
			MatchGateway[roomNumber].player2.pos.x = MatchGateway[roomNumber].canvasWidth - (MatchGateway[roomNumber].wallOffset + MatchGateway[roomNumber].paddleWidth);
			MatchGateway[roomNumber].player2.pos.y = MatchGateway[roomNumber].canvasHeight / 2 - MatchGateway[roomNumber].paddleHeight / 2;
			MatchGateway[roomNumber].ball.pos.x = MatchGateway[roomNumber].canvasWidth / 2 - MatchGateway[roomNumber].ballSize / 2;
			MatchGateway[roomNumber].ball.pos.y = MatchGateway[roomNumber].canvasHeight / 2 - MatchGateway[roomNumber].ballSize / 2;
			MatchGateway[roomNumber].paddleSpeed = MatchGateway[roomNumber].canvasHeight / 50;
			MatchGateway[roomNumber].ballSpeed = MatchGateway[roomNumber].canvasHeight / 75;
			var randomDirection = Math.floor(Math.random() * 2) + 1;
			if (randomDirection % 2) {
				MatchGateway[roomNumber].ball.vel.x = 1;
			} else {
				MatchGateway[roomNumber].ball.vel.x = -1;
			}
			MatchGateway[roomNumber].ball.vel.y = 1;



			const cur_room = this.server.sockets.adapter.rooms.get(roomNumber);

			var numClients = 0;
			if (cur_room) {
				numClients = cur_room.size;
			}

			if (numClients === 0) {
				client.emit('joinedEmptyGame');
				return;
			}
				client.join(roomNumber);
				(client as any).number = 2;
				client.emit('init', 2);
			this.server.to(roomNumber).emit('joinGame', MatchGateway[roomNumber], roomNumber);
			this.startGameInterval(roomNumber, client);
		} catch (error) {
			throw new WsException('start game failed');
		}
	}

	@SubscribeMessage('joinGame')
	async joinGame(client: any, gameState: any) {
		try {
			if (!this.twoFAService.socketIO2fa(client))
				throw new WsException('no 2fa authenticated');
			console.log("JOINED GAME");
			const roomNumber = gameState[1];
			MatchGateway[roomNumber] = gameState[0];

			
			console.log(MatchGateway[roomNumber]);
			client.emit('gameState', JSON.stringify(MatchGateway[roomNumber]));
			client.on('keydown', handleKeyDown);


			// ############################# FUNCTION DECLARATIONS ####################################################

			function handleKeyDown(keyCode: any) {

				const keyInt = parseInt(keyCode); // maybe put in try/catch?
				const vel = getUpdatedVelocity(keyInt);
				if (client.number === 1) {
					if (vel === 1) {
						if (MatchGateway[roomNumber].player1.y_vel >= 1) {
							MatchGateway[roomNumber].player1.y_vel *= 2;
						}
						else
							MatchGateway[roomNumber].player1.y_vel = vel;
					}
					else if (vel === -1) {
						if (MatchGateway[roomNumber].player1.y_vel <= -1) {
							MatchGateway[roomNumber].player1.y_vel *= 2;
						}
						else
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
		} catch (error) {
			throw new WsException('join game failed');
		}
	}

	async startGameInterval(roomNumber: any, client: any) {
		try {
			if (!this.twoFAService.socketIO2fa(client))
				throw new WsException('no 2fa authenticated');	
			const intervalId = setInterval(async () => {
				if (MatchGateway[roomNumber].prematureEnd)
					return clearInterval(intervalId);
				const winner = gameLoop(MatchGateway[roomNumber]);
				if (!winner) {
					// sends new state to all room members
					this.server.to(roomNumber).emit('gameState', JSON.stringify(MatchGateway[roomNumber]));
					if (MatchGateway[roomNumber].scorePlayer1 == 0 && MatchGateway[roomNumber].scorePlayer2 == 1)
						await this.achieve.addAchieve(MatchGateway[roomNumber].player2.userid, 0);
					else if (MatchGateway[roomNumber].scorePlayer2 == 0 && MatchGateway[roomNumber].scorePlayer1 == 1)
						await this.achieve.addAchieve(MatchGateway[roomNumber].player1.userid, 0);
				} else {
					// sends game over to all room members
					this.server.to(roomNumber).emit('gameOver', JSON.stringify(MatchGateway[roomNumber]));
					await this.matchService.updateMatch(roomNumber, MatchGateway[roomNumber]);
					await this.userService.changeUserData(MatchGateway[roomNumber].player1.userid, "user_status", 1);
					await this.userService.changeUserData(MatchGateway[roomNumber].player2.userid, "user_status", 1);
					clearInterval(intervalId); 
					client.emit('userdata-refresh');
				}
			}, 1000 / 30); // argument determines frames per ssecond
		} catch (error) {
			throw new WsException('start game interval failed');
		}
	}

	@SubscribeMessage('sendChallengeRequest') 
	async sendChallengeRequest(client: any, data: any) {	
		try {
			if (!this.twoFAService.socketIO2fa(client))
				throw new WsException('no 2fa authenticated');	
			const opponentid = await this.userService.getUserData(data, 'socket_token');
			if (opponentid[0])
				this.server.to(opponentid[0].socket_token).emit('challengeRequest', client.request.session.passport.user.userid);
		} catch (error) {
			throw new WsException('send challenge request failed');
		}
	}

	@SubscribeMessage('opponentLeft') 
	async opponentLeft(client: any, roomNumber: any) {	
		try {
			if (!this.twoFAService.socketIO2fa(client))
				throw new WsException('no 2fa authenticated');
			MatchGateway[roomNumber].prematureEnd = true;
			await this.matchService.endMatch(roomNumber, MatchGateway[roomNumber], client.request.session.passport.user.userid);
			if (client.request.session.passport.user.userid == MatchGateway[roomNumber].player1.userid)
				await this.userService.changeUserData(MatchGateway[roomNumber].player1.userid, "user_status", 1);
			else if (client.request.session.passport.user.userid == MatchGateway[roomNumber].player2.userid)
				await this.userService.changeUserData(MatchGateway[roomNumber].player2.userid, "user_status", 1);
		} catch (error) {
			throw new WsException('opponent left failed');
		}
	}

	@SubscribeMessage('spectatorLeftMatch') 
	async leaveGameSpectator(client: Socket) {
		try {
			if (!this.twoFAService.socketIO2fa(client))
				throw new WsException('no 2fa authenticated');
			const matchidLeft = await this.matchService.listWatching(client.request.session.passport.user.userid);
			client.leave(matchidLeft[0].matchid);
			console.log("matchid", matchidLeft[0].matchid);
			client.emit('reset');
		}
		catch (error) {
			throw new WsException('spectatorLeftMatch failed');
		}
	}
}
