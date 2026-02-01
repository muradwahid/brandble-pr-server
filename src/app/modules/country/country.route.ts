import { Router } from "express";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { CountryController } from "./country.controller";

const router = Router();

router.post('/create', CountryController.createCountry);
router.get('/get-all', CountryController.getAllCountry);
router.put('/:id', CountryController.updateCountry);
router.delete('/:id', CountryController.deleteCountry);
router.get('/:id', CountryController.getCountryById);



export const CountryRoutes = router;