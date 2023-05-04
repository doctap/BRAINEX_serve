"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var requests_db_1 = require("./db/requests-db");
var helmet_1 = __importDefault(require("helmet"));
var checkJwt_1 = require("./middleware/checkJwt");
var manageFS_1 = require("./utils/manageFS");
var upload_1 = __importDefault(require("./middleware/upload"));
dotenv_1.default.config();
var app = (0, express_1.default)();
var port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5000;
app.use(express_1.default.urlencoded({ extended: true }));
var corsOptions = {
    credentials: true,
    optionsSuccessStatus: 200,
    origin: ['https://some-reviews.onrender.com', 'http://localhost:5000'],
    methods: ['GET', 'POST', 'DELETE'],
};
app.use((0, helmet_1.default)({
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
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.static("public"));
app.use(body_parser_1.default.json());
app.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                console.log('reviews'); // <==
                return [4 /*yield*/, (0, requests_db_1.sqlRequest)("SELECT *,\n\t\tcoalesce((SELECT AVG(user_rating) FROM user_ratings WHERE review_id=reviews.id), '0') AS average_rating\n\t\tFROM Reviews ORDER BY date DESC, Id\n\t\tLIMIT ".concat(body.take, " OFFSET ").concat(body.skip, ";"))];
            case 1:
                r = _a.sent();
                if (r.error) {
                    res.sendStatus(501);
                }
                else {
                    r.body.forEach(function (it) {
                        it.average_rating = parseFloat(it.average_rating).toFixed(1);
                        it.image = (0, manageFS_1.convertBase64)("uploads/".concat(it.image));
                    });
                    res.setHeader("Content-Type", "application/json").status(200).json(r.body);
                }
                return [2 /*return*/];
        }
    });
}); });
app.get("/comments:review_id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reviewId, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('comments'); // <==
                reviewId = req.params.review_id;
                return [4 /*yield*/, (0, requests_db_1.sqlRequest)("SELECT *,\n\t\t\t(SELECT first_name FROM Users WHERE id=Comments.user_id),\n\t\t\t(SELECT last_name FROM Users WHERE id=Comments.user_id)\n\t\tFROM Comments WHERE review_id = ".concat(parseInt(reviewId), ";"))];
            case 1:
                r = _a.sent();
                if (r.error) {
                    res.sendStatus(501);
                }
                else {
                    res.setHeader("Content-Type", "application/json").status(200).json(r.body);
                }
                return [2 /*return*/];
        }
    });
}); });
app.get("/review/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reviewId, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('1 review'); // <==
                reviewId = req.params.id;
                return [4 /*yield*/, (0, requests_db_1.sqlRequest)("SELECT *,\n\t\tcoalesce((SELECT AVG(user_rating) FROM user_ratings WHERE review_id=reviews.id), '0') AS average_rating\n\t\tFROM Reviews WHERE id=".concat(reviewId, ";"))];
            case 1:
                r = _a.sent();
                if (r.error) {
                    res.sendStatus(501);
                }
                else {
                    r.body.forEach(function (it) {
                        it.average_rating = parseFloat(it.average_rating).toFixed(1);
                        it.image = (0, manageFS_1.convertBase64)("uploads/".concat(it.image));
                    });
                    res.setHeader("Content-Type", "application/json").status(200).json(r.body);
                }
                return [2 /*return*/];
        }
    });
}); });
app.post("/protected_Review", checkJwt_1.checkJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                console.log('1 protected_Review'); // <==
                return [4 /*yield*/, (0, requests_db_1.sqlRequest)("SELECT *,\n\t\tcoalesce((SELECT AVG(user_rating) FROM user_ratings WHERE review_id=reviews.id), '0') AS average_rating,\n\t\tcoalesce((SELECT review_like FROM user_ratings WHERE user_id = '".concat(body.sub, "' AND review_id = Reviews.id), '0') AS user_likes_it,\n\t\tcoalesce((SELECT user_rating FROM user_ratings WHERE user_id = '").concat(body.sub, "' AND review_id = Reviews.id), '0') AS user_rating\n\t\tFROM Reviews WHERE id=").concat(body.review_id, " ;"))];
            case 1:
                r = _a.sent();
                if (r.error) {
                    res.sendStatus(501);
                }
                else {
                    r.body.forEach(function (it) {
                        it.average_rating = parseFloat(it.average_rating).toFixed(1);
                        it.image = (0, manageFS_1.convertBase64)("uploads/".concat(it.image));
                    });
                    res.setHeader("Content-Type", "application/json").status(200).json(r.body);
                }
                return [2 /*return*/];
        }
    });
}); });
app.post("/protectedReviews", checkJwt_1.checkJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                console.log('protectedReviews'); // <==
                return [4 /*yield*/, (0, requests_db_1.sqlRequest)("SELECT *,\n\t\tcoalesce((SELECT AVG(user_rating) FROM user_ratings WHERE review_id=reviews.id), '0') AS average_rating,\n\t\tcoalesce((SELECT review_like FROM user_ratings WHERE user_id = '".concat(body === null || body === void 0 ? void 0 : body.sub, "' AND review_id = Reviews.id), '0') AS user_likes_it,\n\t\tcoalesce((SELECT user_rating FROM user_ratings WHERE user_id = '").concat(body === null || body === void 0 ? void 0 : body.sub, "' AND review_id = Reviews.id), '0') AS user_rating\n\t\tFROM Reviews ORDER BY date DESC, Id\n\t\tLIMIT ").concat(body.take, " OFFSET ").concat(body.skip, ";"))];
            case 1:
                r = _a.sent();
                if (r.error) {
                    res.sendStatus(501);
                }
                else {
                    r.body.forEach(function (it) {
                        it.average_rating = parseFloat(it.average_rating).toFixed(1);
                        it.image = (0, manageFS_1.convertBase64)("uploads/".concat(it.image));
                    });
                    res.setHeader("Content-Type", "application/json").status(200).json(r.body);
                }
                return [2 /*return*/];
        }
    });
}); });
app.post("/profilePage", checkJwt_1.checkJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                console.log('profilePage'); // <==
                return [4 /*yield*/, (0, requests_db_1.sqlRequest)("SELECT *,\n\t\tcoalesce((SELECT AVG(user_rating) FROM user_ratings WHERE review_id=reviews.id), '0') AS average_rating,\n\t\tcoalesce((SELECT review_like FROM user_ratings WHERE user_id = '".concat(body.sub, "' AND review_id = Reviews.id), '0') AS user_likes_it,\n\t\tcoalesce((SELECT user_rating FROM user_ratings WHERE user_id = '").concat(body.sub, "' AND review_id = Reviews.id), '0') AS user_rating\n\t\tFROM Reviews WHERE user_id = '").concat(body.sub, "' ORDER BY date DESC, Id\n\t\tLIMIT ").concat(body.take, " OFFSET ").concat(body.skip, ";"))];
            case 1:
                r = _a.sent();
                if (r.error) {
                    res.sendStatus(501);
                }
                else {
                    r.body.forEach(function (it) {
                        it.average_rating = parseFloat(it.average_rating).toFixed(1);
                        it.image = (0, manageFS_1.convertBase64)("uploads/".concat(it.image));
                    });
                    res.setHeader("Content-Type", "application/json").status(200).json(r.body);
                }
                return [2 /*return*/];
        }
    });
}); });
app.post("/createReview", upload_1.default.single('file'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, file, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = JSON.parse(req.body.reviewData);
                file = req.file;
                return [4 /*yield*/, (0, requests_db_1.sqlRequest)("INSERT INTO reviews(text, title, name_work, type, tags, image, author_rating, likes, user_id, date)\n\t\tVALUES ('".concat(body.text, "', '").concat(body.title, "', '").concat(body.name_work, "', '").concat(body.type, "', '").concat(body.tags, "', '").concat(file === null || file === void 0 ? void 0 : file.filename, "', ").concat(body.author_rating, ", 0, '").concat(body.sub, "', '").concat(body.date, "');"))];
            case 1:
                r = _a.sent();
                if (r.error) {
                    res.sendStatus(501);
                }
                else {
                    res.sendStatus(204);
                }
                return [2 /*return*/];
        }
    });
}); });
app.post("/registerUser", checkJwt_1.checkJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.body;
                return [4 /*yield*/, (0, requests_db_1.sqlRequest)("SELECT count(id) as count FROM users WHERE id='".concat(user.sub, "';")).then(function (r) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(r.body[0].count === '0')) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, requests_db_1.sqlRequest)("INSERT INTO Users(first_name, last_name, id)\n\t\t\t\tVALUES('".concat(user === null || user === void 0 ? void 0 : user.given_name, "', '").concat(user === null || user === void 0 ? void 0 : user.family_name, "', '").concat(user === null || user === void 0 ? void 0 : user.sub, "');")).then(function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, (0, requests_db_1.sqlRequest)("SELECT count(id) as result FROM users WHERE id='".concat(user.sub, "';")).then(function (q) {
                                                            res.sendStatus(204);
                                                        })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    if (r.body[0].count !== '0') {
                                        res.sendStatus(204);
                                    }
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.post('/likeReview', checkJwt_1.checkJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                return [4 /*yield*/, (0, requests_db_1.sqlRequest)("SELECT count(user_id) as count FROM user_ratings WHERE user_id='".concat(body === null || body === void 0 ? void 0 : body.sub, "' AND review_id= ").concat(body.review_id, ";")).then(function (c) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(c.body[0].count !== '0')) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, requests_db_1.sqlRequest)("UPDATE user_ratings\n\t\t\t\tSET review_like = ".concat(body.user_likes_it ? 'true' : 'false', "\n\t\t\t\tWHERE review_id = ").concat(body.review_id, " AND user_id = '").concat(body === null || body === void 0 ? void 0 : body.sub, "';\n\t\t\t\t")).then(function () { return res.sendStatus(204); }).catch(function () { return res.sendStatus(501); })];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 2:
                                    if (!(c.body[0].count === '0')) return [3 /*break*/, 4];
                                    return [4 /*yield*/, (0, requests_db_1.sqlRequest)("INSERT INTO user_ratings (user_id, review_id, review_like)\n\t\t\t\tVALUES ('".concat(body.sub, "', ").concat(body.review_id, ", ").concat(body.user_likes_it ? 'true' : 'false', ");\n\t\t\t\t")).then(function () { return res.sendStatus(204); }).catch(function () { return res.sendStatus(501); })];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.post('/giveRating', checkJwt_1.checkJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                return [4 /*yield*/, (0, requests_db_1.sqlRequest)("SELECT count(user_id) as count FROM user_ratings WHERE user_id='".concat(body === null || body === void 0 ? void 0 : body.sub, "' AND review_id= ").concat(body.review_id, ";")).then(function (c) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(c.body[0].count !== '0')) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, requests_db_1.sqlRequest)("UPDATE user_ratings\n\t\t\t\tSET user_rating = ".concat(body.user_rating, "\n\t\t\t\tWHERE review_id = ").concat(body.review_id, " AND user_id = '").concat(body === null || body === void 0 ? void 0 : body.sub, "';\n\t\t\t\t")).then(function () { return res.sendStatus(204); }).catch(function () { return res.sendStatus(501); })];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 2:
                                    if (!(c.body[0].count === '0')) return [3 /*break*/, 4];
                                    return [4 /*yield*/, (0, requests_db_1.sqlRequest)("INSERT INTO user_ratings (user_id, review_id, user_rating)\n\t\t\t\tVALUES ('".concat(body.sub, "', ").concat(body.review_id, ", ").concat(body.user_rating, ");\n\t\t\t\t")).then(function () { return res.sendStatus(204); }).catch(function () { return res.sendStatus(501); })];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.get("/confidential", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("send client policy confidential");
        res.setHeader("Content-Type", "application/json").status(200).json([{ body: 'policy confidential' }]);
        return [2 /*return*/];
    });
}); });
app.delete('/user-deletion', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("DELETE Request Called for /user-deletion endpoint");
        res.send("DELETE Request Called");
        return [2 /*return*/];
    });
}); });
app.use('*', function (req, res) {
    res.status(501).json({ message: 'Only api endpoint available' });
});
app.listen(port, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at https://localhost:".concat(port, " \uD83D\uDE80"));
});
//# sourceMappingURL=server.js.map