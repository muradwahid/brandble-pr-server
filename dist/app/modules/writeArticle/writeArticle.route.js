"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteArticleRoutes = void 0;
const express_1 = require("express");
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const writeArticle_controller_1 = require("./writeArticle.controller");
const router = (0, express_1.Router)();
router.post('/create', FileUploadHelper_1.FileUploadHelper.upload.any(), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return writeArticle_controller_1.WriteArticleController.createWriteArticle(req, res, next);
});
router.get('/get-all', writeArticle_controller_1.WriteArticleController.getAllWriteArticles);
router.get('/:id', writeArticle_controller_1.WriteArticleController.getWriteArticleById);
router.patch('/:id', writeArticle_controller_1.WriteArticleController.updateWriteArticle);
router.delete('/:id', writeArticle_controller_1.WriteArticleController.deleteWriteArticle);
exports.WriteArticleRoutes = router;
