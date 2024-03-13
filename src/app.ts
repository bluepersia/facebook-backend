import express from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
const xss = require ('xss-clean');
import hpp from 'hpp';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookies from 'cookie-parser';
import postRouter from './routes/postRoutes';
import userRouter from './routes/userRoutes';
import imageRouter from './routes/imageRoutes';
import friendshipRouter from './routes/friendshipRoutes';
import reactionRouter from './routes/reactionRoutes';
import commentRouter from './routes/commentRoutes';
import globalErrorHandler from './controller/errorController';
import AppError from './util/AppError';
const app = express ();


app.use (helmet ());
app.use (mongoSanitize ());
app.use (xss ());
app.use (hpp ());

app.use (compression ());

app.use (cors({
    origin: process.env.HOME_URL,
    credentials: true
}))

app.use (express.static (`./public`, {
    setHeaders: res => res.header ('Cross-Origin-Resource-Policy', 'cross-origin')
}))

app.use (rateLimit ({
    windowMs: 5000,
    max: 10,
    message: 'Rate limit exceeded'
}));

app.use (cookies ());

app.use (express.json ({limit: '10kb'}));


app.use ('/api/v1/posts', postRouter);
app.use ('/api/v1/users', userRouter);
app.use ('/api/v1/friends', friendshipRouter);
app.use ('/api/v1/images', imageRouter);
app.use ('/api/v1/reactions', reactionRouter);
app.use ('/api/v1/comments', commentRouter);


app.all ('*', () => { throw new AppError ('Route not found!', 404)});

app.use (globalErrorHandler);

export default app;