import {db} from "../libs/db.js";
import { getJudgeLanguageId, pollBatchResults, submitBatch } from "../libs/judge0.libs.js";

export const createProblem = async (req, res) => {
    const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippet, referenceSolution } = req.body;
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({error: "You are not allowed to create a problem" });
    }

    try {
        for (const [language, solutionCode] of Object.entries(referenceSolution)) {
            const languageId = getJudgeLanguageId(language);
            if (!languageId) {
                return res.status(400).json({ error: `langugage ${language} is not supported` });
            }


            const submissions = testcases.map((tc) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: tc.input,
                expected_output: tc.output
            }))
            const submissionResults = await submitBatch(submissions);
            const tokens = submissionResults.map((res) => res.token);

            const results = await pollBatchResults(tokens);

            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                console.log("Results------", result);
                //console.log(`Testcase ${i+1} and language ${language} ------- result ${result.status.description}`);
                if (result.status.id !== 3) {
                    return res.status(400).json({ error: `Testcase ${i + 1} failed for language ${language}` });
                }

            }
        }

            //save database
            const newProblem = await db.problem.create({
                data: {
                    title,
                    description,
                    difficulty,
                    tags,
                    examples,
                    constraints,
                    testcases,
                    codeSnippet,
                    referenceSolution,
                    userId: req.user.id
                },
            });
            return res.status(201).json({
                success: true,
                message: "Problem created successfully",
                problem:newProblem
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Error creating problem"
        })
    }
}

export const getAllProblems = async (req, res) => {
    try {
        const problems = await db.problem.findMany();
        if (!problems) {
            return res.status(404).json({ error: "No problems found" });
        }
        return res.status(200).json({
            success:true,
            message: "Problems fetched Successsfully",
            problems
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error while Fetching Problems"
        });
    }
    
}

export const getProblemById = async (req, res) => {
    const { id } = req.params;
    try {
        const problem=await db.problem.findUnique({
            where: {
                id
            }
        })
        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }
        return res.status(200).json({
            success: true,
            message:"Problem Found Successfully",
            problem
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
        error: "Error while Fetching Problem",
        });
    }
    
}

export const updateProblem = async (req, res) => {
    const { id } = req.params;
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            error:"You are not allowed to update a problem"
        })
    }
    try {
        const problem = await db.problem.findUnique(
            {
                where: {
                    id
                }
            }
        )
        
        if (!problem) {
            return res.status(404).json({
                error: "Problem not found"
            })
        }
        const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippet, referenceSolution } = req.body;

        if (referenceSolution && testcases) {
            for (const [language, solutionCode] of Object.entries(referenceSolution)) {
                const languageId = getJudgeLanguageId(language);
                if (!languageId) {
                    return res.status(400).json({ error: `langugage ${language} is not supported` });
                }


                const submissions = testcases.map((tc) => ({
                    source_code: solutionCode,
                    language_id: languageId,
                    stdin: tc.input,
                    expected_output: tc.output
                }))
                const submissionResults = await submitBatch(submissions);
                const tokens = submissionResults.map((res) => res.token);

                const results = await pollBatchResults(tokens);

                for (let i = 0; i < results.length; i++) {
                    const result = results[i];
                    console.log("Results------", result);
                    //console.log(`Testcase ${i+1} and language ${language} ------- result ${result.status.description}`);
                    if (result.status.id !== 3) {
                        return res.status(400).json({ error: `Testcase ${i + 1} failed for language ${language}` });
                    }

                }
            }
        }
        const updatedProblem = await db.problem.update({
            where: {id},
            data: {
                title, description, difficulty, tags, examples, constraints, testcases, codeSnippet, referenceSolution
            }
        })
        return res.status(200).json({
            success:true,
            message: "Problem updated successFully",
            updatedProblem
        })

    } catch (error) {
        return res.status(500).json({
            error: "Error while updating problem"
        })
    }
    
}

export const deleteProblem = async (req, res) => {
    const { id } = req.params;
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
        error: "You are not allowed to update a problem",
        });
    }
    try {
        const problem = await db.problem.findUnique({
            where: { id }
        })
        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }
        await db.problem.delete({
            where: { id }
        })
        return res.status(200).json({
            success: true,
            message: "Problem deleted Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Error while deleting Problem"
        })
    }
}

export const getAllProblemsSolvedByUser = async (req, res) => {
    try {
        const problems= await db.problem.findMany({
            where: {
                solvedBy: {
                    some: {
                        userId: req.user.id
                    }
                }
            },
            include: {
                solvedBy: {
                    where: {
                        userId: req.user.id
                    }
                }
            }
        })
        return res.status(200).json({
            success: true,
            message: "Problems fetched successfully",
            problems
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error while fetching problems" });
    }
}