import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { userRegisterSchema, userLoginSchema } from '../validators/user.validator.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.post('/register', validateRequest(userRegisterSchema), register);
router.post('/login', validateRequest(userLoginSchema), login);

export default router;
