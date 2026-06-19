import { Router } from 'express';
import {
    // deleteVideo,
    getAllVideos,
    // getVideoById,
    publishVideo,
    togglePublishStatus,
    updateVideo,
    getMyVideos,
    getVideoById
} from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middlewear.js";

import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
console.log("VIDEO ROUTES LOADED");



router.get("/", getAllVideos);


// User's own videos
router.get("/profile", verifyJWT, getMyVideos);


router.get("/:id", getVideoById);





router.post(
  "/",
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishVideo
);





/* =========================
   ✏️ UPDATE / DELETE
========================= */

// Get single video
// router.get("/:videoId", getVideoById);

// router.delete("/:videoId", verifyJWT, deleteVideo);

router.patch(
  "/:videoId",
  verifyJWT,
  upload.single("thumbnail"),
  updateVideo
);

router.patch("/toggle/publish/:videoId", verifyJWT, togglePublishStatus);

export default router