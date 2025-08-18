import { Router } from 'express';
import { WriteArticleController } from './writeArticle.controller';

const router = Router();

router.post('/create', WriteArticleController.createWriteArticle);
router.get('/all-articles', WriteArticleController.getAllWriteArticles);
router.get('/:id', WriteArticleController.getWriteArticleById);
router.patch('/:id', WriteArticleController.updateWriteArticle);
router.delete('/:id', WriteArticleController.deleteWriteArticle);


export const WriteArticleRoutes = router;
