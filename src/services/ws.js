import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-streams-adapter";

class Ws {
    io;
    booted = false;
    redisClient = createClient({ host: "localhost", port: 6379 });

    boot(server) {
        /**
         * Start Redis server connection
         */
        this.redisClient.connect();
        /**
         * Ignore multiple calls to the boot method
         */
        if (this.booted) {
            return;
        }

        this.booted = true;
        this.io = new Server(server, { adapter: createAdapter(this.redisClient) });
    }
}

export default new Ws();
