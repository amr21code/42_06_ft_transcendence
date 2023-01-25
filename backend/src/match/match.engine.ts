import { ConsoleLogger } from "@nestjs/common";
import { MatchGameStateDto } from "./dto/matchgamestate.dto";

export function createGameState() {
	return {
		player1: {
			pos: {
				x: 0,
				y: 0,
			},
			y_vel: 0,
		},
		player2: {
			pos: {
				x: 0,
				y: 0,
			},
			y_vel: 0,
		},
		ball: {
			pos: {
				x: 0,
				y: 0,
			},
			vel: {
				x: 0,
				y: 0,
			}
		},
		paddleWidth: 0,
		paddleHeight: 0,
		ballSize: 0,
		wallOffset: 0,
		canvasHeight: 0,
		canvasWidth: 0,
		stepSize: 0,
	}
}

export function gameLoop (state: MatchGameStateDto) {

	if (!state) {
		return;
	}
	
	const playerOne = state.player1;
	const playerTwo = state.player2;
	const ball = state.ball;

	// if key pressed ->
	// playerOne.pos.y += playerOne.y_vel; // -> MAKE THIS READ KEYS INSTEAD
	
	// LOGIC FOR SCORED GOAL HERE
	// LOGIC FOR WON/LOST GAME HERE
	// maybe: logic for player left?

	// MOVED BELOW INTO KEY
	if ( state.player1.y_vel === -1 && (state.player1.pos.y <= 20)) {
		state.player1.y_vel = 0;
	}

	if ( state.player1.y_vel === 1 && (state.player1.pos.y + state.paddleHeight >= state.canvasHeight - 20))  {
		state.player1.y_vel = 0;
	}
	
	state.player1.pos.y += state.player1.y_vel * state.stepSize;
	state.player1.y_vel = 0;
	// else if (state.player1.y_vel == 1 && !(state.player1.pos.y + state.paddleHeight >= state.canvasHeight - 20)) {
	// 	// state.player1.y_vel = vel;
	// 	state.player1.pos.y += state.player1.y_vel * state.stepSize;
	// }

	// make sure paddle is actually moving, before we move it
	//if (playerOne.yvel)


	// if (Game.keysPressed[KeyBindings.UP]) {
	// 	this.yVel = -1;
	// 	if (this.y <= 20) {
	// 		this.yVel = 0
	// 	}
	// } else if (Game.keysPressed[KeyBindings.DOWN]) {
	// 	this.yVel = 1;
	// 	if (this.y + this.height >= canvas.height - 20){
	// 		this.yVel = 0;
	// 	}
	// } else {
	// 	this.yVel = 0;
	// }
	
	// this.y += this.yVel * this.speed;

	return false; // game is still running
}

export function getUpdatedVelocity(keyCode: number) {
	switch (keyCode) {
		case 38: { // down
			return (-1);
		}
		case 40: { // up
			return (1);
		}
	}
	return (0);
}

export default { createGameState, gameLoop, getUpdatedVelocity };