import { NextFunction, Request, Response, Router } from 'express';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { WonArticleController } from './wonArticle.controller';

const router = Router();


router.post('/create',FileUploadHelper.pdfUpload.array('file'), (req:Request, res:Response,next:NextFunction) => {
        req.body = JSON.parse(req.body.data);
        return WonArticleController.createWonArticle(req, res,next)
});
// router.post('/create',WonArticleController.createWonArticle);
router.get('/get-all', WonArticleController.getAllWonArticles);
router.get('/:id', WonArticleController.getWonArticleById);
router.patch('/:id', WonArticleController.updateWonArticle);
router.delete('/:id', WonArticleController.deleteWonArticle);

export const WonArticleRoutes = router;
