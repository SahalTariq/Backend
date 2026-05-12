import { Router } from "express";
import {
    addComment,
    updateComment,
    deleteComment,
    getVideoComments,
    getComments
} from '../controllers/comment.controller.js';
import { verifyJWT } from "../middlewares/auth.middlewear.js";

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

// ✅ UNCOMMENTED - This is what you need for GET /api/v1/comments
router.get("/allcomments", getComments);

// Routes with videoId parameter
router.route("/:videoId").get(getVideoComments).post(addComment);

// Routes with commentId parameter
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

// Debug logging
console.log("✅ Comment routes registered:");
console.log("  - GET    /api/v1/comments");
console.log("  - GET    /api/v1/comments/:videoId");
console.log("  - POST   /api/v1/comments/:videoId");
console.log("  - DELETE /api/v1/comments/c/:commentId");
console.log("  - PATCH  /api/v1/comments/c/:commentId");

export default router;