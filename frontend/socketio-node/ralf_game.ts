// --------------GAME STATE-------------
function createGameState() {
	return {
		player1: {
			pos: {
				x: 0,
				y: 0,
			},
		},
		player2: {
			pos: {
				x: 0,
				y: 0,
			},
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
	}
}

function gameLoop (state: any) {

}

export default { createGameState, gameLoop };