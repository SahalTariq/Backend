import { Router } from 'express';
import {getSubscribedChannels }from '../controllers/subscription.controller.js'
import {toggleSubscription} from '../controllers/subscription.controller.js'
import {getUserChannelSubscribers} from '../controllers/subscription.controller.js'
// import {verifyJWT} from "../middlewares/auth.middleware.js"
import { verifyJWT } from '../middlewares/auth.middlewear.js';

const router = Router();
router.use(verifyJWT)
router
    .route("/c/:channelId")
    .post(toggleSubscription);

router
    .route("/c/:subscriberId")
    .get(getSubscribedChannels)

router.route("/u/:channelId").get(getUserChannelSubscribers);

export default router