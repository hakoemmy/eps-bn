import { PORT } from './constants';
import server from './server';
import Database from './services/database';

server.listen(PORT, Database.connect);
