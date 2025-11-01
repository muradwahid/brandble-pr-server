"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WonArticleRoutes = void 0;
const express_1 = require("express");
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const wonArticle_controller_1 = require("./wonArticle.controller");
const router = (0, express_1.Router)();
router.post('/create', FileUploadHelper_1.FileUploadHelper.pdfUpload.array('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return wonArticle_controller_1.WonArticleController.createWonArticle(req, res, next);
});
// router.post('/create',WonArticleController.createWonArticle);
router.get('/get-all', wonArticle_controller_1.WonArticleController.getAllWonArticles);
router.get('/:id', wonArticle_controller_1.WonArticleController.getWonArticleById);
router.patch('/:id', wonArticle_controller_1.WonArticleController.updateWonArticle);
router.delete('/:id', wonArticle_controller_1.WonArticleController.deleteWonArticle);
exports.WonArticleRoutes = router;
