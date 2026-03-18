import { Router } from "express";
import { logoutUser, registerUser,loginUser,refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
// import { loginUser } from "../controllers/login.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewear.js";

const router = Router()

router.route('/register').post(
    upload.fields([
        {name:'avatar',maxCount:1},
        {name:'coverImage',maxCount:1}
    ]),
    registerUser)

router.route('/login').post(loginUser)

// secure routes

router.route('/logout').post(verifyJWT,logoutUser)
router.route('/refresh-token').post(refreshAccessToken)



export default router;