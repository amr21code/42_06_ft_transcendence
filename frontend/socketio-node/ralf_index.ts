// RALFS IMPLEMENTATION AS BY THIS TUTORIAL: https://www.youtube.com/watch?v=ppcBIHv_ZPs

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
	cors: {
	  origins: ['http://localhost:5173']
	}
});

const { createGameState, gameLoop } = require('./ralf_game')
const FRAME_RATE = 10;
// import createGameState from './ralf_game';

io.on('connection', (client) => {
	const state = createGameState();

	startGameInterval(client, state);
})

function startGameInterval(client: any, state: any) {
	const intervalId = setInterval(() => {
		const winner = gameLoop(state);
		if (!winner) {
			client.emit('gameState', JSON.stringify(state));
		}
		else {
			client.emit('gameOver');
			clearInterval(intervalId);
		}
	}, 1000 / FRAME_RATE)

}

http.listen(3003, () => {
    console.log('listening on *:3003');
});
