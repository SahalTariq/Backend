import { Router } from "express";
import {
    addComment,
    updateComment,
    deleteComment,
    getVideoComments,
    // getComments
} from '../controllers/comment.controller.js';

import { verifyJWT } from "../middlewares/auth.middlewear.js"

const router = Router();

console.log("verifyJWT:", verifyJWT);

// Apply verifyJWT middleware to all routes in this file
// router.use(verifyJWT);

// ✅ UNCOMMENTED - This is what you need for GET /api/v1/comments
// router.get("/allcomments", getComments);

// Routes with videoId parameter
// router.route("/:videoId").post(addComment);

router.use((req, res, next) => {
  console.log("ROUTER HIT:", req.method, req.url);
  next();
});

router.post("/:videoId", verifyJWT, addComment);
// router.route('/:videoId').post(verifyJWT,addComment)
// router.route("/:Id").get(getVideoComments)
router.get("/:Id", getVideoComments);


// Routes with commentId parameter
router
  .route("/:commentId")
  .patch(verifyJWT, updateComment)
  .delete(verifyJWT, deleteComment);

// Debug logging
console.log("✅ Comment routes registered:");
console.log("  - GET    /api/v1/comments");
console.log("  - GET    /api/v1/comments/:videoId");
console.log("  - POST   /api/v1/comments/:videoId");
console.log("  - DELETE /api/v1/comments/c/:commentId");
console.log("  - PATCH  /api/v1/comments/c/:commentId");

export default router;