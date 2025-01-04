import jobModel from "../models/jobModel.js";
import mongoose from "mongoose";
import moment from "moment";

//===============CREATE JOB==============\\
export const createJobConroller = async (req, res, next) => {
  const { company, position } = req.body;

  if (!company || !position) {
    next("Please provide all fields");
  }
  req.body.createdBy = req.user.userId;
  const job = await jobModel.create(req.body);
  res.status(201).json({ msg: "Job Created Succesfully", job });
};

//============ GET JOB ================//
export const getAllJobController = async (req, res, next) => {
  const { status, workType, search, sort } = req.query;

  //conditions for searching and filter

  
  const queryObject = {
    createdBy: req.user.userId,
  };
  //logic
  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }

  if (search) {
    queryObject.position = { $regex: search, $options: "i" }; //$regex is used for search a keyword
  }

  let queryResult = jobModel.find(queryObject);

  //sorting

  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }

  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }

  if(sort === "a-z"){
    queryResult = queryResult.sort("position")
  }

  if(sort === "z-a"){
    queryResult = queryResult.sort("-position")
  }

  const page = Number(req.query.page) || 1;
  const limit  = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  queryResult = queryResult.skip(skip).limit(limit);

  const totalJobs = await jobModel.countDocuments(queryResult)

  const jobs = await queryResult;
  // const jobs = await jobModel.find({ createdBy: req.user.userId });
  res.status(200).json({
    totalJobs,
    jobs,
  });
};

// ===================UPDATE JOB ===============//

export const updateJobController = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;
  // Validation
  if (!company || !position) {
    next("Please provide all fields");
  }

  //Find job

  const job = await jobModel.findOne({ _id: id });

  if (!job) {
    next(`No jobs found for this id ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next("You are not authorized to update this id");
  }

  const updatedJob = await jobModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  res
    .status(200)
    .json({ msg: "Your job has been updated Sucessfully", updatedJob });
};

//delete job

export const deleteJobController = async (req, res, next) => {
  const { id } = req.params;

  const job = await jobModel.findOne({ _id: id });
  if (!job) {
    next(`There is no Job found for this id: ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next("You are not authorized to delete this id");
    return;
  }
  await jobModel.deleteOne();

  res.status(204).json({ msg: "Job is deleted Sucessfully" });
};

//==================== JOBS-STATS & FILTER ======================

export const jobsStatsController = async (req, res, next) => {
  const stats = await jobModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  //default stats
  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };

  //monthly yearly stats

  let monthlyApplication = await jobModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { month, year },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM y");
      return { date, count };
    })
    .reverse();

  res
    .status(200)
    .json({ totalJobs: stats.length, stats, defaultStats, monthlyApplication });
};
