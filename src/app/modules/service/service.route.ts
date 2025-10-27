import { Router } from 'express';
import { ServiceController } from './service.controller';

const router = Router();

router.post('/create', ServiceController.createService);
router.get('/all-services', ServiceController.getAllServices);
router.get('/:id', ServiceController.getServiceById);
router.patch('/:id', ServiceController.updateService);
router.delete('/:id', ServiceController.deleteService);

export const ServiceRoutes = router;
