"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = void 0;
var express_jwt_1 = require("express-jwt");
var jwks_rsa_1 = __importDefault(require("jwks-rsa"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var domain = process.env.AUTH0_DOMAIN;
var audience = process.env.AUTH0_AUDIENCE;
exports.checkJwt = (0, express_jwt_1.expressjwt)({
    secret: jwks_rsa_1.default.expressJwtSecret({
        cache: true,
        // ограничение максимального количества запросов
        rateLimit: true,
        // 10 запросов в минуту
        jwksRequestsPerMinute: 10,
        // обратите внимание на сигнатуру пути
        jwksUri: "https://".concat(domain, "/.well-known/jwks.json")
    }),
    // аудитория
    audience: audience,
    // тот, кто подписал токен
    issuer: "https://".concat(domain, "/"),
    // алгоритм, использованный для подписания токена
    algorithms: ['RS256']
});
//cc0f5da250d9af55fa19a955d94915ca face
//# sourceMappingURL=checkJwt.js.map