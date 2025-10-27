import { NextFunction, Request, Response, Router } from 'express';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { WriteArticleController } from './writeArticle.controller';

const router = Router();

router.post('/create',FileUploadHelper.upload.any(),  (req:Request, res:Response,next:NextFunction) => {
        req.body = JSON.parse(req.body.data);
        return WriteArticleController.createWriteArticle(req, res,next)
} );
router.get('/get-all', WriteArticleController.getAllWriteArticles);
router.get('/:id', WriteArticleController.getWriteArticleById);
router.patch('/:id', WriteArticleController.updateWriteArticle);
router.delete('/:id', WriteArticleController.deleteWriteArticle);


export const WriteArticleRoutes = router;
