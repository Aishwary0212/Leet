// HomePage.jsx
import React, { useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { Loader, AlertCircle } from "lucide-react";
import ProblemTable from "../components/ProblemTable";

const HomePage = () => {
  const {
    problems,
    solvedProblems,
    isProblemsLoading,
    isProblemSolved,
    fetchProblemsWithSolvedStatus,
  } = useProblemStore();

  useEffect(() => {
    fetchProblemsWithSolvedStatus();
  }, [fetchProblemsWithSolvedStatus]);


  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      {/* Background glow */}
      <div className="absolute top-16 left-0 w-1/3 h-1/3 bg-primary opacity-30 blur-3xl rounded-md"></div>

      {/* Header */}
      <div className="z-10 text-center max-w-3xl mt-8">
        <h1 className="text-4xl font-extrabold">
          Welcome to <span className="text-primary">LeetLab</span>
        </h1>
        <p className="mt-4 text-lg font-semibold text-gray-500 dark:text-gray-400">
          A Platform Inspired by Leetcode which helps you to prepare for coding
          interviews and improve your coding skills by solving problems
        </p>
      </div>

      {/* Problem Table */}
      {problems.length > 0 ? (
        <ProblemTable problems={problems} solvedProblems={solvedProblems} />
      ) : (
        <div className="mt-10 text-center z-10">
          <div className="inline-flex flex-col items-center border border-primary/30 px-8 py-12 rounded-2xl bg-base-200/50">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">
              No problems found
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Add problems via the admin panel to get started
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
