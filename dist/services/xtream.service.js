"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xtreamService = void 0;
const users_json_1 = __importDefault(require("../data/users.json"));
exports.xtreamService = {
    getUsers: async () => {
        // Placeholder: in a real implementation this would query DB or read files dynamically
        return users_json_1.default;
    }
};
