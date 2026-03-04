import { all } from "axios";
import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.libs.js";
import { db } from "../libs/db.js";

export const executeCode = async (req, res) => {
    try {
        const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;
        const userId = req.user.id;
        //Validate Test Cases if in Array format or not
        if (
            !Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length
        ) {
            return res.status(400).json({ error: "Invalid or Missing test cases" });
        }

        const submissions = stdin.map((input) => ({
            source_code,
            language_id,
            stdin: input
        }));
        const submitResponse = await submitBatch(submissions);
        const tokens = submitResponse.map((res) => res.token);
        
        const results = await pollBatchResults(tokens);

        console.log("Results-------------------------------------------------");
        console.log(results);

        const allPassed = true;
        const detailedResults = results.map((result, index) => {
            const stdout = result.stdout?.trim();
            const expected_output = expected_outputs[index]?.trim();

            const passed = stdout === expected_output;
            if (!passed) {
                allPassed = false;
            }
            return {
                testCase: index + 1,
                passed,
                stdout,
                expected: expected_output,
                stderr: result.stderr || null,
                compile_output: result.compile_output || null,
                status: result.status.description,
                memory: result.memory ? `${result.memory} KB` : undefined,
                time:result.time ? `${result.time} s` : undefined
            }
            // console.log(`testcase #${index + 1}`);
            // console.log(`Input ${stdin[index]}`);
            // console.log(`Expected Output ${expected_output}`);
            // console.log(`Actual Output ${stdout}`);
            // console.log(`Matched ${passed}`);
        })
        console.log(detailedResults);
        const submission = await db.submission.create({
            data: {
                userId,
                problemId,
                sourceCode:source_code,
                language: getLanguageName(language_id),
                stdin: stdin.join("\n"),
                stdout: JSON.stringify(detailedResults.map((res) => res.stdout)),
                stderr: detailedResults.some((r) => r.stderr) ? JSON.stringify(detailedResults.map((res) => res.stderr)) : null,
                compileOutput: detailedResults.some((r) => r.compile_output) ? JSON.stringify(detailedResults.map((res) => res.compile_output)) : null,
                status: allPassed ? "Accepted" : "Wrong Answer",
                memory: detailedResults.some((r) => r.memory) ? JSON.stringify(detailedResults.map((res) => res.memory)) : null,

                
            }
        })
        if (allPassed) {
            await db.ProblemSolved.upsert({

                where: {
                    userId_problemId: {
                        userId,
                        problemId,
                    },
                },
                update: {},
                create: {
                    userId,problemId
                }
            });
        }
        const testCaseResults = detailedResults.map((result) => ({
            submissionId: submission.id,
            testCase: result.testCase,
            passed: result.passed,
            stdout: result.stdout,
            expected:result.expected,
            stderr: result.stderr,
            compiledOutput: result.compile_output,
            status: result.status,
            memory: result.memory,
            time:result.time,
            
        }))
        await db.testCasesResult.createMany({
            data: testCaseResults
        });

        const submissionWithTestCase = await db.submission.findUnique({
            where: {
                id:submission.id
            },
            include: {
                testCases:true
            }
        })
        return res.status(200).json({
            success:"true",
            message: "Code Executed successfully",
            submission:submissionWithTestCase
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error while executing code"});
    }
};
