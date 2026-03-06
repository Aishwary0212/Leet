// store/useProblemStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useProblemStore = create((set, get) => ({
    problems: [],
    problem: null,
    solvedProblems: [], // Array of solved problem IDs or objects
    isProblemsLoading: false,
    isProblemLoading: false,

    getAllProblems: async () => {
        try {
        set({ isProblemsLoading: true });
        const res = await axiosInstance.get("/problems/get-all-problems");
        set({ problems: res.data.problems });
        } catch (error) {
        console.log("Error getting all problems", error);
        toast.error("Error in getting problems");
        } finally {
        set({ isProblemsLoading: false });
        }
    },

    getProblemById: async (id) => {
        try {
        set({ isProblemLoading: true });
        const res = await axiosInstance.get(`/problems/get-problem/${id}`);
        set({ problem: res.data.problem });
        toast.success(res.data.message);
        } catch (error) {
        console.log("Error getting problem", error);
        toast.error("Error in getting problem");
        } finally {
        set({ isProblemLoading: false });
        }
    },

    getSolvedProblemByUser: async () => {
        try {
        const res = await axiosInstance.get("/problems/get-solved-problems");
        // Ensure we store an array of problem IDs for easy lookup
        const solvedIds = res.data.problems?.map((p) => p.id || p._id) || [];
        set({ solvedProblems: solvedIds });
        } catch (error) {
        console.log("Error getting solved problems", error);
        toast.error("Error getting solved problems");
        }
    },
    isProblemSolved: (problemId) => {
        const { solvedProblems } = get();
        return solvedProblems.includes(problemId);
    },
    fetchProblemsWithSolvedStatus: async () => {
        await Promise.all([
            get().getAllProblems(),
            get().getSolvedProblemByUser()
        ]);
    },
}));
