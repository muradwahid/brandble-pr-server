import { Router } from "express";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { StateController } from "./state.controller";

const router = Router();

router.post('/create', StateController.createState);
router.get('/get-all', StateController.getAllState);
router.put('/:id', StateController.updateState);
router.delete('/:id', StateController.deleteState);
router.get('/:id', StateController.getStateById);



export const StateRoutes = router;