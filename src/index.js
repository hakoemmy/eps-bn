import { PORT } from './constants';
import server from './server';
import Database from './services/database';
import notificationsWorker from './services/notifications-queue-worker';

server.listen(PORT, Database.connect, notificationsWorker);
