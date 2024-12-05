import express from "express";
import { getGroups, getOneGroup, createAGroup, createNewPost } from "../controllers/groupController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getGroups);
router.get("/:groupId", getOneGroup );

router.post("/", auth, createAGroup);
router.post("/:groupId/posts", auth, createNewPost);

export default router;