"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var moment_1 = __importDefault(require("moment"));
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        var date = (0, moment_1.default)().format('DDMMYYY-HHmmss_SSS');
        cb(null, "".concat(date, "-").concat(file.originalname));
    }
});
var fileFilter = function (req, file, cb) {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
var upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
});
exports.default = upload;
//# sourceMappingURL=upload.js.map