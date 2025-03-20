import { Router } from "express";
import authCtrl from "../controllers/auth-controller.js";
import {checkSchema} from "express-validator"
import { upload } from "../middlewares/multer.js";
import authenticateUser from "../middlewares/authenticateUser.js";
import { loginValidationSchema, signupValidationSchema } from "../validators/auth-validator.js";
const authRouter=Router();


authRouter.post("/signup",checkSchema(signupValidationSchema),authCtrl.signup)

authRouter.post("/login",checkSchema(loginValidationSchema),authCtrl.login);

authRouter.patch("/update-profile",authenticateUser,upload.single("profilePic"),authCtrl.updateProfile);

authRouter.get("/profile",authenticateUser,authCtrl.profile);

export default authRouter;