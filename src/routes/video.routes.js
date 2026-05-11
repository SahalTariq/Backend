import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishVideo,
    togglePublishStatus,
    updateVideo,
    getMyVideos
} from "../controllers/video.controller.js"
// import {verifyJWT} from "../middlewares/auth.middleware.js"
import { verifyJWT } from "../middlewares/auth.middlewear.js";

import {upload} from "../middlewares/multer.middleware.js"

const router = Router();


// router
//     .route("/")
//     .get(getAllVideos)
//     .post(
//         upload.fields([
//             {
//                 name: "videoFile",
//                 maxCount: 1,
//             },
//             {
//                 name: "thumbnail",
//                 maxCount: 1,
//             },
            
//         ]),
//         publishVideo
//     );


/* =========================
   🌍 PUBLIC ROUTES
========================= */

// Get all videos (Home page)
router.get("/", getAllVideos);

// Get single video
router.get("/:videoId", getVideoById);


/* =========================
   🔐 PRIVATE ROUTES
========================= */

// Upload video (login required)
router.post(
  "/",
  // "/upload",
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishVideo
);

// User's own videos
router.get("/my-videos", verifyJWT, getMyVideos);


/* =========================
   ✏️ UPDATE / DELETE
========================= */

router.delete("/:videoId", verifyJWT, deleteVideo);

router.patch(
  "/:videoId",
  verifyJWT,
  upload.single("thumbnail"),
  updateVideo
);

router.patch("/toggle/publish/:videoId", verifyJWT, togglePublishStatus);

export default router