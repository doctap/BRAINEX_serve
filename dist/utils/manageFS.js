"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertBase64 = void 0;
var fs_1 = __importDefault(require("fs"));
var convertBase64 = function (path) {
    var bitmap = fs_1.default.readFileSync(path);
    return bitmap.toString('base64');
};
exports.convertBase64 = convertBase64;
//# sourceMappingURL=manageFS.js.map