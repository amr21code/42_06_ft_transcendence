// --------------GAME STATE-------------
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
	}
}

export function gameLoop (state: any) {
	if (!state) {
		return;
	}
	
	const playerOne = state.player1;
	playerOne.pos.y += playerOne.y_vel;

	
	if (playerOne.pos.y <= 20 || playerOne.pos.y + state.paddleHeight >= state.canvasHeight - 20) { // WHY 20?
		this.yVel = 0
	}

	// LOGIC FOR SCORED GOAL HERE

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

// export default { createGameState, gameLoop };