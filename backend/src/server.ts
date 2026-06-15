// colocal el type en reques y respnse por el tsconfig y evitar su rebla de verbatimModuleSyntax
import cookieParser from 'cookie-parser';
import express, {type Request,type Response,type NextFunction } from "express";
import cors from 'cors';
import https from "node:https";
import fs from "node:fs";
import apiRouter from './index.js';

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'https://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use(cookieParser());

app.use('/api', apiRouter);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: "Backend corriendo en Type"});
});

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

https.createServer(options, app).listen(PORT, () => {
    console.log(`Server en https://localhost:${PORT}`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) =>{
    console.error('Error no manejado en los controladores', err);
    res.status(500).json({message:"Error interno del servidor"});
});