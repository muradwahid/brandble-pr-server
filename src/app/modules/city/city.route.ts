import { Router } from "express";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { CityController } from "./city.controller";

const router = Router();

router.post('/create', CityController.createCity);
router.get('/get-all', CityController.getAllCity);
router.put('/:id', CityController.updateCity);
router.delete('/:id', CityController.deleteCity);
router.get('/:id', CityController.getCityById);



export const CityRoutes = router;