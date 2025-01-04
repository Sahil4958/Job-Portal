import express from "express";
import {
  createJobConroller,
  deleteJobController,
  getAllJobController,
  jobsStatsController,
  updateJobController,
} from "../controller/jobController.js";
import userAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

//create job
router.post("/create-job", userAuth, createJobConroller);

//get all job
router.get("/get-jobs", userAuth, getAllJobController);

//update job
router.post("/update-job/:id", userAuth, updateJobController);

//delete job
router.delete("/delete-job/:id", userAuth, deleteJobController);

//aggregate stats-filter job

router.get("/jobs-stats", userAuth, jobsStatsController);
export default router;
