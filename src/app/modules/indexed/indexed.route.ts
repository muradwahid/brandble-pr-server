import { Router } from "express";
import { IndexedController } from "./indexed.controller";
const router = Router();

router.post('/create', IndexedController.createIndexed);
router.get('/get-all', IndexedController.getAllIndexes);
router.put('/:id', IndexedController.updateIndexed);
router.delete('/:id', IndexedController.deleteIndexed);
router.get('/:id', IndexedController.getIndexedById);

export const IndexedRoutes = router;