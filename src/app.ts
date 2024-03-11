import express from 'express';
import postRouter from './routes/postRoutes';
import globalErrorHandler from './controller/errorController';
import AppError from './util/AppError';
const app = express ();


app.use (express.json ({limit: '10kb'}));


app.use ('/api/v1/posts', postRouter);

app.all ('*', () => { throw new AppError ('Route not found!', 404)});

app.use (globalErrorHandler);

export default app;