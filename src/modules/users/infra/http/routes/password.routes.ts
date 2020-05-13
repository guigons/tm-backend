import { Router } from 'express';
import ForgotPasswordContoller from '../controllers/ForgotPasswordContoller';
import ResetPasswordController from '../controllers/ResetPasswordContoller';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordContoller();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post('/forgot', forgotPasswordController.create);
passwordRouter.post('/reset', resetPasswordController.create);

export default passwordRouter;
