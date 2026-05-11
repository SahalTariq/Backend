import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middlewear.js';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"


const router = Router();
router.use(verifyJWT);

router.route("/").post(createTweet);
router.route("/getUserTweets").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router