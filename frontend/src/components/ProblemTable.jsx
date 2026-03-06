// components/ProblemsTable.jsx
import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  Bookmark,
  PencilIcon,
  TrashIcon,
  Plus,
  CheckCircle,
  Circle,
} from "lucide-react";
import { useActions } from "../store/useAction";
import AddToPlaylistModal from "./AddToPlaylistModal";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";

const ProblemsTable = ({ problems, solvedProblemIds = [] }) => {
    const { authUser } = useAuthStore();
    const { onDeleteProblem } = useActions();
    const { createPlaylist } = usePlaylistStore();

    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("ALL");
    const [selectedTag, setSelectedTag] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
        useState(false);
    const [selectedProblemId, setSelectedProblemId] = useState(null);

    // Extract all unique tags from problems
    const allTags = useMemo(() => {
        if (!Array.isArray(problems)) return [];
        const tagsSet = new Set();
        problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
        return Array.from(tagsSet);
    }, [problems]);

    const difficulties = ["EASY", "MEDIUM", "HARD"];

    // Filter problems
    const filteredProblems = useMemo(() => {
        return (problems || [])
        .filter((problem) =>
            problem.title?.toLowerCase().includes(search.toLowerCase()),
        )
        .filter((problem) =>
            difficulty === "ALL" ? true : problem.difficulty === difficulty,
        )
        .filter((problem) =>
            selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag),
        );
    }, [problems, search, difficulty, selectedTag]);

    // Pagination
    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
    const paginatedProblems = useMemo(() => {
        return filteredProblems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
        );
    }, [filteredProblems, currentPage]);

    // ✅ Simple solved check using passed solvedProblemIds
    const isSolved = (problem) => {
        const problemId = problem.id || problem._id;
        return solvedProblemIds.includes(problemId);
    };

    const handleDelete = (id) => {
        onDeleteProblem(id);
    };

    const handleCreatePlaylist = async (data) => {
        await createPlaylist(data);
    };

    const handleAddToPlaylist = (problemId) => {
        setSelectedProblemId(problemId);
        setIsAddToPlaylistModalOpen(true);
    };

    return (
        <div className="w-full max-w-6xl mx-auto mt-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Problems</h2>
            <button
            className="btn btn-primary gap-2"
            onClick={() => setIsCreateModalOpen(true)}
            >
            <Plus className="w-4 h-4" />
            Create Playlist
            </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <input
            type="text"
            placeholder="Search by title"
            className="input input-bordered w-full md:w-1/3 bg-base-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
            <select
            className="select select-bordered bg-base-200"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            >
            <option value="ALL">All Difficulties</option>
            {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
                </option>
            ))}
            </select>
            <select
            className="select select-bordered bg-base-200"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            >
            <option value="ALL">All Tags</option>
            {allTags.map((tag) => (
                <option key={tag} value={tag}>
                {tag}
                </option>
            ))}
            </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow-md">
            <table className="table table-zebra table-lg bg-base-200 text-base-content">
            <thead className="bg-base-300">
                <tr>
                <th className="w-16 text-center">Solved</th>
                <th>Title</th>
                <th>Tags</th>
                <th>Difficulty</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {paginatedProblems.length > 0 ? (
                paginatedProblems.map((problem) => {
                    const solved = isSolved(problem);
                    const problemId = problem.id || problem._id;

                    return (
                    <tr key={problemId} className="hover:bg-base-300/50">
                        {/* Solved Status */}
                        <td className="text-center">
                        {solved ? (
                            <CheckCircle className="w-5 h-5 text-success mx-auto fill-success/20" />
                        ) : (
                            <Circle className="w-5 h-5 text-gray-400 mx-auto" />
                        )}
                        </td>

                        {/* Title */}
                        <td>
                        <Link
                            to={`/problem/${problemId}`}
                            className="font-semibold hover:underline text-primary"
                        >
                            {problem.title}
                        </Link>
                        </td>

                        {/* Tags */}
                        <td>
                        <div className="flex flex-wrap gap-1">
                            {(problem.tags || []).slice(0, 3).map((tag, idx) => (
                            <span
                                key={idx}
                                className="badge badge-outline badge-warning text-xs"
                            >
                                {tag}
                            </span>
                            ))}
                            {problem.tags?.length > 3 && (
                            <span className="text-xs text-gray-500">
                                +{problem.tags.length - 3}
                            </span>
                            )}
                        </div>
                        </td>

                        {/* Difficulty */}
                        <td>
                        <span
                            className={`badge font-semibold text-xs text-white ${
                            problem.difficulty === "EASY"
                                ? "badge-success"
                                : problem.difficulty === "MEDIUM"
                                ? "badge-warning"
                                : "badge-error"
                            }`}
                        >
                            {problem.difficulty}
                        </span>
                        </td>

                        {/* Actions */}
                        <td>
                        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                            {authUser?.role === "ADMIN" && (
                            <div className="flex gap-2">
                                <button
                                onClick={() => handleDelete(problemId)}
                                className="btn btn-sm btn-error"
                                title="Delete problem"
                                >
                                <TrashIcon className="w-4 h-4 text-white" />
                                </button>
                                <button
                                disabled
                                className="btn btn-sm btn-warning"
                                title="Edit problem (coming soon)"
                                >
                                <PencilIcon className="w-4 h-4 text-white" />
                                </button>
                            </div>
                            )}
                            <button
                            className="btn btn-sm btn-outline flex gap-2 items-center"
                            onClick={() => handleAddToPlaylist(problemId)}
                            title="Add to playlist"
                            >
                            <Bookmark className="w-4 h-4" />
                            <span className="hidden sm:inline">Save</span>
                            </button>
                        </div>
                        </td>
                    </tr>
                    );
                })
                ) : (
                <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                    No problems found.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
            <button
                className="btn btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
            >
                Prev
            </button>
            <span className="btn btn-ghost btn-sm">
                {currentPage} / {totalPages}
            </span>
            <button
                className="btn btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
            >
                Next
            </button>
            </div>
        )}

        {/* Modals */}
        <CreatePlaylistModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreatePlaylist}
        />

        <AddToPlaylistModal
            isOpen={isAddToPlaylistModalOpen}
            onClose={() => setIsAddToPlaylistModalOpen(false)}
            problemId={selectedProblemId}
        />
        </div>
    );
};

export default ProblemsTable;
