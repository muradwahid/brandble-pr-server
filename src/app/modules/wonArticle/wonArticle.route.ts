import { Router } from 'express';
import { WonArticleController } from './wonArticle.controller';

const router = Router();

router.post('/create', WonArticleController.createWonArticle);
router.get('/get-all-articles', WonArticleController.getAllWonArticles);
router.get('/:id', WonArticleController.getWonArticleById);
router.patch('/:id', WonArticleController.updateWonArticle);
router.delete('/:id', WonArticleController.deleteWonArticle);

export const WonArticleRoutes = router;
