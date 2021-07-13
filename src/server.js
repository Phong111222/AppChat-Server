import express from 'express';
import cors from 'cors';
import 'colors';
import MongoConnect from './database/mongodb';
import errorMiddleware from './middleware/errorMiddleware';
import baseAuth from './middleware/baseAuth';
import AuthRouter from './routes/auth';

const URI = '/api/v1';

MongoConnect();
const app = express();

app.use(express.json());
app.use(cors());

app.use(`${URI}/user`, baseAuth, AuthRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.yellow);
});
