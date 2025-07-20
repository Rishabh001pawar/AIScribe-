import express from "express";
import {
  chatWithAI,
  generateNoteIdeas,
  improveNote,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", chatWithAI);
router.post("/generate-ideas", generateNoteIdeas);
router.post("/improve-note", improveNote);

export default router;
