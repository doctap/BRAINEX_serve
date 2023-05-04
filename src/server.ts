import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import {
	IRequestSlice,
	IBody,
	ILike,
	IUser,
	IReview,
	IUserData,
	IRate,
	ICreateReview,
	ReviewId,
	ITokenSub,
	IReviewId,
	IComment
} from './types/data-contracts';
import { sqlRequest } from './db/requests-db';
import helmet from 'helmet';
import { checkJwt } from './middleware/checkJwt';
import { convertBase64 } from './utils/manageFS';
import upload from './middleware/upload'

dotenv.config();

const app = express();
const port = process.env.PORT ?? 5000;
app.use(express.urlencoded({ extended: true }));

const corsOptions: CorsOptions = {
	credentials: true,
	optionsSuccessStatus: 200,
	origin: ['https://some-reviews.onrender.com', 'http://localhost:5000'],
	methods: ['GET', 'POST', 'DELETE'],
}

app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'"],
			styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
			imgSrc: ["*", "'self'", 'data:', 'https:'],
			connectSrc: ["'self'", 'https://recommendations-app.eu.auth0.com/oauth/token'],
			fontSrc: ["'self'", 'https://fonts.gstatic.com'],
			objectSrc: ["'self'"],
			mediaSrc: ["'self'"],
			frameSrc: ["'self'", "recommendations-app.eu.auth0.com"],
		},
	}
}));
app.use(cors(corsOptions));

app.use(express.static("public"));

app.use(bodyParser.json());


app.post("/", async (req: IBody<IRequestSlice>, res: Response<IReview[]>) => {
	const body = req.body;

	console.log('reviews')// <==
	//==========================

	const r = await sqlRequest<IReview>(
		`SELECT *,
		coalesce((SELECT AVG(user_rating) FROM user_ratings WHERE review_id=reviews.id), '0') AS average_rating
		FROM Reviews ORDER BY date DESC, Id
		LIMIT ${body.take} OFFSET ${body.skip};`
	);
	if (r.error) {
		res.sendStatus(501)
	} else {
		r.body.forEach(it => {
			it.average_rating = parseFloat(it.average_rating).toFixed(1);
			it.image = convertBase64(`uploads/${it.image}`);
		})
		res.setHeader("Content-Type", "application/json").status(200).json(r.body);
	}
})

app.get("/comments:review_id", async (req, res: Response<IComment[]>) => {

	console.log('comments')// <==
	//==========================

	const reviewId = req.params.review_id;

	const r = await sqlRequest<IComment>(
		`SELECT *,
			(SELECT first_name FROM Users WHERE id=Comments.user_id),
			(SELECT last_name FROM Users WHERE id=Comments.user_id)
		FROM Comments WHERE review_id = ${parseInt(reviewId)};`
	);
	if (r.error) {
		res.sendStatus(501)
	} else {
		res.setHeader("Content-Type", "application/json").status(200).json(r.body);
	}
})

app.get("/review/:id", async (req, res: Response<IReview[]>) => {

	console.log('1 review')// <==
	//==========================

	const reviewId = req.params.id;

	const r = await sqlRequest<IReview>(
		`SELECT *,
		coalesce((SELECT AVG(user_rating) FROM user_ratings WHERE review_id=reviews.id), '0') AS average_rating
		FROM Reviews WHERE id=${reviewId};`
	);
	if (r.error) {
		res.sendStatus(501)
	} else {
		r.body.forEach(it => {
			it.average_rating = parseFloat(it.average_rating).toFixed(1);
			it.image = convertBase64(`uploads/${it.image}`);
		})
		res.setHeader("Content-Type", "application/json").status(200).json(r.body);
	}
})

app.post("/protected_Review", checkJwt, async (req: IBody<IReviewId & ITokenSub>, res: Response<IReview[]>) => {
	const body = req.body;

	console.log('1 protected_Review')// <==
	//==========================

	const r = await sqlRequest<IReview>(
		`SELECT *,
		coalesce((SELECT AVG(user_rating) FROM user_ratings WHERE review_id=reviews.id), '0') AS average_rating,
		coalesce((SELECT review_like FROM user_ratings WHERE user_id = '${body.sub}' AND review_id = Reviews.id), '0') AS user_likes_it,
		coalesce((SELECT user_rating FROM user_ratings WHERE user_id = '${body.sub}' AND review_id = Reviews.id), '0') AS user_rating
		FROM Reviews WHERE id=${body.review_id} ;`
	);
	if (r.error) {
		res.sendStatus(501)
	} else {
		r.body.forEach(it => {
			it.average_rating = parseFloat(it.average_rating).toFixed(1);
			it.image = convertBase64(`uploads/${it.image}`)
		})
		res.setHeader("Content-Type", "application/json").status(200).json(r.body);
	}
})

app.post("/protectedReviews", checkJwt, async (req: IBody<IRequestSlice & IUser & IUserData>, res: Response<IReview[]>) => {
	const body = req.body;

	console.log('protectedReviews')// <==
	//==========================

	const r = await sqlRequest<IReview>(
		`SELECT *,
		coalesce((SELECT AVG(user_rating) FROM user_ratings WHERE review_id=reviews.id), '0') AS average_rating,
		coalesce((SELECT review_like FROM user_ratings WHERE user_id = '${body?.sub}' AND review_id = Reviews.id), '0') AS user_likes_it,
		coalesce((SELECT user_rating FROM user_ratings WHERE user_id = '${body?.sub}' AND review_id = Reviews.id), '0') AS user_rating
		FROM Reviews ORDER BY date DESC, Id
		LIMIT ${body.take} OFFSET ${body.skip};`
	);
	if (r.error) {
		res.sendStatus(501)
	} else {
		r.body.forEach(it => {
			it.average_rating = parseFloat(it.average_rating).toFixed(1);
			it.image = convertBase64(`uploads/${it.image}`)
		})
		res.setHeader("Content-Type", "application/json").status(200).json(r.body);
	}
})

app.post("/profilePage", checkJwt, async (req: IBody<IRequestSlice & ITokenSub>, res: Response<IReview[]>) => {
	const body = req.body;

	console.log('profilePage')// <==
	//==========================

	const r = await sqlRequest<IReview>(
		`SELECT *,
		coalesce((SELECT AVG(user_rating) FROM user_ratings WHERE review_id=reviews.id), '0') AS average_rating,
		coalesce((SELECT review_like FROM user_ratings WHERE user_id = '${body.sub}' AND review_id = Reviews.id), '0') AS user_likes_it,
		coalesce((SELECT user_rating FROM user_ratings WHERE user_id = '${body.sub}' AND review_id = Reviews.id), '0') AS user_rating
		FROM Reviews WHERE user_id = '${body.sub}' ORDER BY date DESC, Id
		LIMIT ${body.take} OFFSET ${body.skip};`
	);
	if (r.error) {
		res.sendStatus(501)
	} else {
		r.body.forEach(it => {
			it.average_rating = parseFloat(it.average_rating).toFixed(1);
			it.image = convertBase64(`uploads/${it.image}`)
		})
		res.setHeader("Content-Type", "application/json").status(200).json(r.body);
	}
})

app.post("/createReview", upload.single('file'), async (req, res) => {
	const body: ICreateReview = JSON.parse(req.body.reviewData);
	const file = req.file;
	const r = await sqlRequest(
		`INSERT INTO reviews(text, title, name_work, type, tags, image, author_rating, likes, user_id, date)
		VALUES ('${body.text}', '${body.title}', '${body.name_work}', '${body.type}', '${body.tags}', '${file?.filename}', ${body.author_rating}, 0, '${body.sub}', '${body.date}');`
	);
	if (r.error) {
		res.sendStatus(501)
	} else {
		res.sendStatus(204)
	}
})

app.post("/registerUser", checkJwt, async (req: IBody<IUser>, res: Response) => {
	const user = req.body;
	await sqlRequest(
		`SELECT count(id) as count FROM users WHERE id='${user.sub}';`
	).then(async (r) => {
		if (r.body[0].count === '0') {
			await sqlRequest(
				`INSERT INTO Users(first_name, last_name, id)
				VALUES('${user?.given_name}', '${user?.family_name}', '${user?.sub}');`
			).then(async () => {
				await sqlRequest(
					`SELECT count(id) as result FROM users WHERE id='${user.sub}';`
				).then(q => {
					res.sendStatus(204)
				})
			})
		} else if (r.body[0].count !== '0') {
			res.sendStatus(204)
		}
	})
})

app.post('/likeReview', checkJwt, async (req: IBody<ILike>, res) => {
	const body = req.body;
	await sqlRequest(
		`SELECT count(user_id) as count FROM user_ratings WHERE user_id='${body?.sub}' AND review_id= ${body.review_id};`
	).then(async (c) => {
		if (c.body[0].count !== '0') {
			await sqlRequest(
				`UPDATE user_ratings
				SET review_like = ${body.user_likes_it ? 'true' : 'false'}
				WHERE review_id = ${body.review_id} AND user_id = '${body?.sub}';
				`
			).then(() => res.sendStatus(204)).catch(() => res.sendStatus(501))
		}
		else if (c.body[0].count === '0') {
			await sqlRequest(
				`INSERT INTO user_ratings (user_id, review_id, review_like)
				VALUES ('${body.sub}', ${body.review_id}, ${body.user_likes_it ? 'true' : 'false'});
				`
			).then(() => res.sendStatus(204)).catch(() => res.sendStatus(501))
		}
	})
})

app.post('/giveRating', checkJwt, async (req: IBody<IRate>, res) => {
	const body = req.body;
	await sqlRequest(
		`SELECT count(user_id) as count FROM user_ratings WHERE user_id='${body?.sub}' AND review_id= ${body.review_id};`
	).then(async (c) => {
		if (c.body[0].count !== '0') {
			await sqlRequest(
				`UPDATE user_ratings
				SET user_rating = ${body.user_rating}
				WHERE review_id = ${body.review_id} AND user_id = '${body?.sub}';
				`
			).then(() => res.sendStatus(204)).catch(() => res.sendStatus(501))
		}
		else if (c.body[0].count === '0') {
			await sqlRequest(
				`INSERT INTO user_ratings (user_id, review_id, user_rating)
				VALUES ('${body.sub}', ${body.review_id}, ${body.user_rating});
				`
			).then(() => res.sendStatus(204)).catch(() => res.sendStatus(501))
		}
	})
})
  


app.get(`/confidential`, async (req, res) => {
	console.log("send client policy confidential")
	res.setHeader("Content-Type", "application/json").status(200).json([{ body: 'policy confidential' }]);
})

app.delete('/user-deletion', async (req, res) => {
	console.log("DELETE Request Called for /user-deletion endpoint")
	res.send("DELETE Request Called")
})

app.use('*', (req, res) => {
	res.status(501).json({ message: 'Only api endpoint available' })
})

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${port} 🚀`);
});