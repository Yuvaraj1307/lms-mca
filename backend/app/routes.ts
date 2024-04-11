import express from "express";
import { healthCheck, user, member, book, transaction, login } from "./controller"

const router = express.Router();
router.use("/health-check", healthCheck);
router.use("/user", user);
router.use("/member", member);
router.use("/book", book);
router.use("/transaction", transaction);
router.use("/login", login);

export default router;