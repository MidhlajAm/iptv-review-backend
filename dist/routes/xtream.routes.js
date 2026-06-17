"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xtreamRoutes = void 0;
const express_1 = require("express");
const xtream_controller_1 = require("../controllers/xtream.controller");
exports.xtreamRoutes = (0, express_1.Router)();
exports.xtreamRoutes.get('/categories/users', xtream_controller_1.xtreamController.getUsers);
