import { db } from "../libs/db.js";

export const getAllSubmission = async (req, res) => {
  try {
    const userId = req.user.id;
    const submission = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submission,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error while fetching submissions" });
  }
};

export const getSubmissionsForProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.problemId;
    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error while fetching submissions" });
  }
};

export const getAllTheSubmissionsForProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const submissions = await db.submission.count({
      where: {
        problemId: problemId,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error while fetching submissions Count" });
  }
};
