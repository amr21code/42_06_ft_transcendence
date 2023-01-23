// RALFS IMPLEMENTATION AS BY THIS TUTORIAL: https://www.youtube.com/watch?v=ppcBIHv_ZPs

import express from "express";
const app = express();
// const app = require('express')();

import { createServer } from 'http';
const http = createServer(app);
// const http = require('http').createServer(app);

import { Server, Socket } from 'socket.io'
const io = new Server(http);
// const io = require('socket.io')(http, {
// 	cors: {
// 	  origins: ['http://localhost:5173']
// 	}
// });

// const { createGameState, gameLoop } = require('./ralf_game')
import { createGameState, gameLoop } from './ralf_game.js'; // WHY THE F*CK ist das .js??
const FRAME_RATE = 10;
// import { createGameState, gameLoop } from './ralf_game';

io.on('connection', (socket: Socket) => {
	const state = createGameState();

	startGameInterval(socket, state);
});

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
