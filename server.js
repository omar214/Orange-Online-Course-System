import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import allRoutes from './api/index.js';
import config from './config/index.js';
import apiLimiter from './middlewares/reatLimit.js';
import {
	handleNotFound,
	handleRouteError,
} from './middlewares/errorHandler.js';

const app = express();
// Middlewares
app.use(express.urlencoded({ extended: true })); // send nested objects
app.use(express.json()); // serve static files
if (config.ENV === 'dev') {
	app.use(cors());
	app.use(morgan('dev'));
} else {
	const corsOptions = {
		origin: config.SERVER_URL,
	};
	app.use(cors(corsOptions));
}

// DB connection
mongoose
	.connect(config.dbURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((result) => {
		console.log('connected to db ');
		console.log(`serve at http://localhost:${config.PORT}`);
		app.listen(config.PORT);
	})
	.catch((err) => {
		console.log(`couldn't connect to db `, err);
		process.exit(0);
	});

// Routes which should handle requests
app.use('/api', apiLimiter, allRoutes);
app.use(handleRouteError); // handle errors
app.use('*', handleNotFound); // handle not found routes

export default app;
