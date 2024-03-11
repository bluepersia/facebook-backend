import express from 'express';
import cookies from 'cookie-parser';
import postRouter from './routes/postRoutes';
import userRouter from './routes/userRoutes';
import imageRouter from './routes/imageRoutes';
import friendshipRouter from './routes/friendshipRoutes';
import globalErrorHandler from './controller/errorController';
import AppError from './util/AppError';
const app = express ();


app.use (cookies ());

app.use (express.json ({limit: '10kb'}));


app.use ('/api/v1/posts', postRouter);
app.use ('/api/v1/users', userRouter);
app.use ('/api/v1/friends', friendshipRouter);
app.use ('/api/v1/images', imageRouter);

app.all ('*', () => { throw new AppError ('Route not found!', 404)});

app.use (globalErrorHandler);

export default app;