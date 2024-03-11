import express from 'express';
import postRouter from './routes/postRoutes';
const app = express ();


app.use (express.json ({limit: '10kb'}));


app.use ('/api/v1/posts', postRouter);

export default app;