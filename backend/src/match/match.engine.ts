import { ConsoleLogger } from "@nestjs/common";
import { MatchGameStateDto } from "./dto/matchgamestate.dto";

export function createGameState() {
	return {
		player1: {
			userid: "",
			pos: {
				x: 0,
				y: 0,
			},
			y_vel: 0,
		},
		player2: {
			userid: "",
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
		paddleSpeed: 0,
		ballSpeed: 0,
		scorePlayer1: 0,
		scorePlayer2: 0,
		drawLineWidth: 7,
		prematureEnd: false,
	}
}

export function gameLoop(state: MatchGameStateDto) {

	if (!state) {
		return;
	}

	const playerOne = state.player1;
	const playerTwo = state.player2;
	const ball = state.ball;


	// ################ MOVE PLAYER ###################################################
	// Only update position, if player doesn't touch match court boundaries
	// if clause makes sure paddle is actually moving, before we check how to move it
	if (playerOne.y_vel) {

		if (playerOne.y_vel === -1 && (playerOne.pos.y <= 2)) {
			playerOne.y_vel = 0;
		}

		if (playerOne.y_vel === 1 && (playerOne.pos.y + state.paddleHeight >= state.canvasHeight - 2)) {
			playerOne.y_vel = 0;
		}

		playerOne.pos.y += playerOne.y_vel * state.paddleSpeed;
		playerOne.y_vel = 0;
	}

	if (playerTwo.y_vel) {

		if (playerTwo.y_vel === -1 && (playerTwo.pos.y <= 2)) {
			playerTwo.y_vel = 0;
		}

		if (playerTwo.y_vel === 1 && (playerTwo.pos.y + state.paddleHeight >= state.canvasHeight - 2)) {
			playerTwo.y_vel = 0;
		}

		playerTwo.pos.y += playerTwo.y_vel * state.paddleSpeed;
		playerTwo.y_vel = 0;
	}
	// ################ MOVE PLAYER END ###################################################


	// ################ MOVE BALL ###################################################
	// make sure paddle is actually moving, before we check how to move it
	if (ball.vel.x || ball.vel.y) {

		//check top canvas bounds
		if (ball.pos.y <= 0) {
			ball.vel.y = 1;
		}

		//check bottom canvas bounds
		if (ball.pos.y + state.ballSize >= state.canvasHeight) {
			ball.vel.y = -1;
		}

		//check left canvas bounds
		if (ball.pos.x <= 0) {
			ball.pos.x = state.canvasWidth / 2 - state.ballSize / 2;
			ball.vel.x = -1;
			// player two scored
			state.scorePlayer2++;
			// if (state.scorePlayer2 == 11) // game ends here
			// 	return 2;
		}

		//check right canvas bounds
		if (ball.pos.x + state.ballSize >= state.canvasWidth) {
			ball.pos.x = state.canvasWidth / 2 - state.ballSize / 2;
			ball.vel.x = 1;
			// player one scored
			state.scorePlayer1++;
			// if (state.scorePlayer1 == 11) // game ends here
			// 	return 1;
		}

		//check playerOne collision
		if (ball.pos.x <= playerOne.pos.x + state.paddleWidth && ball.pos.x > playerOne.pos.x) {
			if (ball.pos.y >= playerOne.pos.y && ball.pos.y <= playerOne.pos.y + state.paddleHeight) {
				ball.vel.x = 1;
			}
		}

		//check playerTwo collision
		if (ball.pos.x + state.ballSize >= playerTwo.pos.x && ball.pos.x < playerTwo.pos.x) {
			if (ball.pos.y >= playerTwo.pos.y && ball.pos.y <= playerTwo.pos.y + state.paddleHeight) {
				ball.vel.x = -1;
			}
		}
		ball.pos.x += ball.vel.x * state.ballSpeed;
		ball.pos.y += ball.vel.y * state.ballSpeed;
	}
	// ################ MOVE BALL END ###################################################

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