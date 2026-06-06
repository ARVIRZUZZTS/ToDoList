// colocal el type en reques y respnse por el tsconfig y evitar su rebla de verbatimModuleSyntax
import cookieParser from 'cookie-parser';
import express, {type Request,type Response,type NextFunction } from "express";
import cors from 'cors';
import apiRouter from './index.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use(cookieParser());

app.use('/api', apiRouter);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: "Backend corriendo en Type"});
});

app.listen(PORT, () => {
    console.log(`Server en http://localhost:${PORT}`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) =>{
    console.error('Error no manejado en los controladores', err);
    res.status(500).json({message:"Error interno del servidor"});
});