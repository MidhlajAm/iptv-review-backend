"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xtreamController = void 0;
const xtream_service_1 = require("../services/xtream.service");
exports.xtreamController = {
    getUsers: async (_req, res) => {
        const users = await xtream_service_1.xtreamService.getUsers();
        res.status(200).json({ users });
    }
};
