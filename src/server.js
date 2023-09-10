import express from 'express';
import helmet from 'helmet';
// eslint-disable-next-line import/no-extraneous-dependencies
import morgan from 'morgan';
import passport from 'passport';
import cors from './middleware/cors';
import passportConfig from './middleware/passport';
import routes from './routes';

const { json, urlencoded } = express;
const app = express();
const env = app.get('env');

if (env === 'development') app.use(morgan('dev'));
else if (env === 'staging') app.use(morgan('combined'));
else if (env === 'production') app.use(morgan('tiny'));

app.use(json(), urlencoded({ extended: true }));
app.use(cors, helmet(), passport.initialize());

passportConfig(passport);
app.use('/api', routes);

export default app;
