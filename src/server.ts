import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import {IUserData,IRequestBase, ILoginResponse} from './types/data-contracts';
import helmet from 'helmet';
import { checkToken, getToken, removeToken } from './middleware/checkJwt';
import { users } from './data/users';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 5000;
app.use(express.urlencoded({ extended: true }));

const corsOptions: CorsOptions = {
	credentials: true,
	optionsSuccessStatus: 200,
	origin: ['http://localhost:3000'],
	methods: ['GET', 'POST', 'DELETE'],
}

app.use(helmet());
app.use(cors(corsOptions));

// app.use(express.static("public"));

app.use(bodyParser.json());

app.get("/games/:token", async (req: Request<IRequestBase>, res) => {
	const token = req.params['token'];

	console.log(req.params)

	if (checkToken(token)) {
		res.sendFile(__dirname + '/data/data.json')
	} else {
		res.sendStatus(401);
	}
});

app.post("/login", async (req: Request<IUserData>, res) => {
	const body = req.body;

	const isValid = users.some(u => u.login === body.login && u.password === body.password);

	if (isValid) {
		res.send({ token: getToken(), userName: body.login });
	} else {
		res.sendStatus(401);
	}
});

app.delete("/logout/:token", async (req: Request<IRequestBase>, res) => {
	const token = req.params['token'];

	if (removeToken(token)) {
		res.sendStatus(200);
	} else {
		res.sendStatus(404);
	}
})

app.use('*', (req, res) => {
	res.status(501).json({ message: 'Only api endpoint available' })
})

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${port} 🚀`);
});