import 'reflect-metadata'
import { container } from "./inversify.config";
import cors from 'cors'
import express, { Express } from 'express'
import { InversifyExpressServer } from 'inversify-express-utils';
import config from 'config';
import { DBConnection } from './db/db.config';

const corsOptions = {
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
const server = new InversifyExpressServer(container)
server.setConfig(app => {
    app.use(cors(corsOptions))
    app.use(express.json())
})
DBConnection()
server.build().listen(config.get("portNumber"), () => {
    console.log(`http://localhost:${config.get("portNumber")}`);
})

