import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewear.js";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";


const router = Router()

router.use(verifyJWT)

router.route('/videos').get(getChannelVideos)
router.route('/stats').get(getChannelStats)

export default router