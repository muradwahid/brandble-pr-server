import { Router } from 'express';
import { PublicationController } from './publication.controller';

const router = Router();

router.post('/create', PublicationController.createPublication);
router.get('/all-publications', PublicationController.getAllPublications);
router.get('/:id', PublicationController.getPublicationById);
router.patch('/:id', PublicationController.updatePublication);
router.delete('/:id', PublicationController.deletePublication);

export const PublicationRoutes = router;