CREATE TABLE Users (
	id varchar(100) NOT NULL,
	first_name VARCHAR(20) NOT NULL,
	last_name VARCHAR(20) NOT NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

INSERT INTO
	Users(id, first_name, last_name)
VALUES
	('1', 'Meadow', 'Crystalfreak'),
	('2', 'Buddy-Ray', 'Perceptor'),
	('3', 'Prince', 'Flitterbell'),
	('4', 'Frank', 'Holland'),
	('5', 'Ursula', 'McKinney'),
	('6', 'Amy', 'Townsend'),
	('7', 'Grace', 'Jacobs'),
	('8', 'Joella', 'Hill'),
	('9', 'Lorin', 'Harris'),
	('10', 'Morgan', 'Bridges');

CREATE TABLE Reviews (
	id SERIAL PRIMARY KEY NOT NULL,
	title VARCHAR(100) NOT NULL,
	text TEXT NOT NULL,
	name_work VARCHAR(100) NOT NULL,
	type VARCHAR(30) NOT NULL,
	tags TEXT,
	image VARCHAR(100) NOT NULL,
	author_rating SMALLINT NOT NULL,
	likes INTEGER NOT NULL DEFAULT 0,
	user_id varchar(100),
	date timestamptz NOT NULL,
	FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
);

INSERT INTO
	reviews (
		title,
		text,
		name_work,
		type,
		tags,
		image,
		author_rating,
		likes,
		user_id,
		date
	)
VALUES
	(
		'Lorem ipsum',
		'simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
		'Van Helsing',
		'book',
		'#book #horror',
		'book-vanHelsing.jpg',
		7,
		0,
		'1',
		'2022-12-25 03:24:00+00'
	),
	(
		'JavaScript',
		'simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
		'JavaScript. Полное руководство',
		'book',
		'#book #programming #javascript #webdevelop',
		'book-javascript.jpg',
		8,
		0,
		'2',
		'2022-12-22 03:24:00+00'
	),
	(
		'TypeScript',
		'simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
		'TypeScript. Подробное Руководство',
		'book',
		'#book #programming #typescript #webdevelop',
		'book-typescript.jpg',
		9,
		0,
		'3',
		'2022-12-14 03:24:00+00'
	),
	(
		'Lorem ipsum',
		'simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
		'Звездный лорд',
		'book',
		'#book #fantasy',
		'book-звезныйЛорд.jpg',
		3,
		0,
		'4',
		'2022-12-11 03:24:00+00'
	),
	(
		'Lorem ipsum',
		'simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
		'Значит, я умерла',
		'book',
		'#book #thriller',
		'book-значитЯУмерла.jpg',
		6,
		0,
		'5',
		'2022-12-11 03:24:00+00'
	),
	(
		'Lorem ipsum',
		'simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
		'Инверсия жизни',
		'book',
		'#book #horror',
		'book-инверсияЖизни.jpg',
		9,
		0,
		'6',
		'2022-12-01 03:24:00+00'
	);

CREATE TABLE Comments (
	user_id varchar(100) NOT NULL,
	review_id INTEGER NOT NULL,
	text TEXT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE,
	FOREIGN KEY (review_id) REFERENCES Reviews (id) ON DELETE CASCADE
);

INSERT INTO
	Comments (user_id, review_id, text)
VALUES
	('1', 1, 'but also the leap into electronic'),
	('2', 1, 'age editors now use Lorem Ipsum'),
	('3', 1, 'age editors now use Lorem Ipsum'),
	(
		'4',
		5,
		'generators on the Internet tend to repeat predefined chunks as necessary'
	),
	(
		'3',
		5,
		'It has roots in a piece of classical Latin literature from 45 BC'
	),
	(
		'5',
		6,
		'There are many variations of passages'
	),
	(
		'7',
		6,
		'and going through the cites of the word in'
	),
	(
		'10',
		2,
		'and going through the cites of the word in'
	),
	('7', 2, 'age editors now use Lorem Ipsum'),
	(
		'5',
		3,
		'Hampden-Sydney College in Virginia'
	),
	(
		'4',
		4,
		'generators on the Internet tend to repeat predefined chunks as necessary'
	),
	(
		'3',
		4,
		'It has roots in a piece of classical Latin literature from 45 BC'
	),
	(
		'2',
		3,
		'There are many variations of passages'
	),
	(
		'5',
		3,
		'and going through the cites of the word in'
	);

CREATE TABLE User_Ratings (
	user_id varchar(100),
	review_id INTEGER,
	user_rating SMALLINT,
	review_like boolean DEFAULT false,
	FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE,
	FOREIGN KEY (review_id) REFERENCES Reviews (id) ON DELETE CASCADE
);

INSERT INTO
	User_Ratings (user_id, review_id, user_rating, review_like)
VALUES
	('1', 2, 2, false),
	('1', 3, 3, false),
	('3', 4, 5, false),
	('4', 4, 4, false),
	('1', 1, 4, false),
	('3', 1, 1, false),
	('4', 5, 2, false),
	('3', 5, 4, false),
	('5', 6, 1, false),
	('7', 6, 4, false),
	('3', 3, 1, false),
	('2', 2, 3, false),
	('2', 3, 3, false),
	('2', 4, 4, false),
	('2', 1, 2, false);

CREATE TABLE User_Roles (
	user_id varchar(100) NOT NULL,
	role VARCHAR(50) NOT NULL,
	FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
);