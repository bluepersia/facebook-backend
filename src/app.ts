import express from 'express';
import postRouter from './routes/postRoutes';
import globalErrorHandler from './controller/errorController';
const app = express ();


app.use (express.json ({limit: '10kb'}));


app.use ('/api/v1/posts', postRouter);


app.use (globalErrorHandler);

export default app;