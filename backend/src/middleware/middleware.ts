import * as session from 'express-session';


export const sessionMiddleware = session({
	name: 'ft_pong',
	secret: "390qofjsliufmpc90a3wrpoa938wmrcpaw3098rmcpa0", // entfernen und in env stecken
	resave: true,
	saveUninitialized: false,
	httpOnly: true,
	cookie: {}
});

export const wrap = nestMiddleware => (socket, next) => nestMiddleware(socket.request, {}, next);


module.exports = { sessionMiddleware, wrap };