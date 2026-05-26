"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonRoutes = void 0;
const express_1 = require("express");
const common_controller_1 = require("./common.controller");
const router = (0, express_1.Router)();
router.get('/get-all', common_controller_1.CommonController.getAllCommon);
exports.CommonRoutes = router;
