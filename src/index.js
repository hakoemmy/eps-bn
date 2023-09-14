import http from "http";
import { verify } from 'jsonwebtoken';
import { PORT } from './constants';
import appServer from './server';
import Database from './services/database';
import notificationsWorker from './services/notifications-queue-worker';
import Ws from './services/ws';
import {
    JWT_KEY,
} from '../src/constants';
import models from '../src/models';

const { User } = models;
const server = http.createServer(appServer);

server.listen(PORT, Database.connect, notificationsWorker);

Ws.boot(server);

Ws.io.use(async (socket, next) => {
    try {

        const err = new Error("UN_AUTHORIZED_ACCESS");

        if (
            socket?.handshake &&
            socket.handshake?.auth &&
            socket.handshake.auth?.token
        ) {
            const user = verify(socket.handshake.auth?.token, JWT_KEY);

            socket.user = {
                id: user.id,
                role: user.role,
            };
        } else {
            next(err);
        }

        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
});

Ws.io.on('connection', async (socket) => {
    const existingUser = await User.findOne({
        where: {
            id: socket.user.id
        }
    });

    if (existingUser) {
        // establish notification room for this user
        socket.join(`notification:${socket.user.id}`);
    }

    console.log(socket.rooms)
});

Ws.io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});