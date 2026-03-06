import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useProblemStore } from "../store/useProblemStore";
import {
  ArrowLeft,
  Trash2,
  Edit,
  ExternalLink,
  AlertCircle,
  Plus,
} from "lucide-react";
import Navbar from "../components/Navbar";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const {
    currentPlaylist,
    getPlaylistDetails,
    isLoading,
    error,
    deletePlaylist,
  } = usePlaylistStore();
  const { problems: allProblems } = useProblemStore();

  useEffect(() => {
    if (playlistId) {
      getPlaylistDetails(playlistId);
    }
  }, [playlistId, getPlaylistDetails]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-base-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-base-100">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <AlertCircle className="w-16 h-16 text-error mb-4" />
          <h2 className="text-3xl font-bold mb-2">Failed to load playlist</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            {error}
          </p>
          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="btn btn-outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
            <button
              onClick={() => getPlaylistDetails(playlistId)}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle not found
  if (!currentPlaylist) {
    return (
      <div className="min-h-screen flex flex-col bg-base-100">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-3xl font-bold mb-2">Playlist not found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            The playlist you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/playlist")}
            className="btn btn-primary"
          >
            View All Playlists
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-success bg-success/10 border border-success/20";
      case "medium":
        return "text-warning bg-warning/10 border border-warning/20";
      case "hard":
        return "text-error bg-error/10 border border-error/20";
      default:
        return "text-gray-500 bg-gray-500/10 border border-gray-500/20";
    }
  };

  const handleDeletePlaylist = async () => {
    if (
      confirm(
        "Are you sure you want to delete this playlist? This action cannot be undone.",
      )
    ) {
      await deletePlaylist(playlistId);
      navigate("/playlist");
    }
  };

  const handleRemoveProblem = async (problemId) => {
    if (confirm("Remove this problem from the playlist?")) {
      // Add your remove problem logic here
      // await removeProblemFromPlaylist(playlistId, problemId);
      // getPlaylistDetails(playlistId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div className="flex items-start gap-4">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-ghost btn-circle mt-1 hover:bg-base-300"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-base-content">
                  {currentPlaylist.name}
                </h1>
                {currentPlaylist.description && (
                  <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl text-lg">
                    {currentPlaylist.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="font-semibold text-primary">
                      {currentPlaylist.problems?.length || 0}
                    </span>
                    {currentPlaylist.problems?.length === 1
                      ? "Problem"
                      : "Problems"}
                  </span>
                  <span>•</span>
                  <span>
                    Created{" "}
                    {new Date(currentPlaylist.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 self-start lg:self-auto">
              <Link
                to={`/playlist/${playlistId}/edit`}
                className="btn btn-outline gap-2 hover:scale-105 transition-transform"
              >
                <Edit className="w-4 h-4" />
                Edit Playlist
              </Link>
              <button
                onClick={handleDeletePlaylist}
                className="btn btn-error gap-2 hover:scale-105 transition-transform"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          {/* Empty State */}
          {currentPlaylist.problems?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-base-200/50">
              <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">No problems added yet</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md text-lg">
                Start adding problems to this playlist to organize your practice
                sessions.
              </p>
              <div className="flex gap-3">
                <Link to="/" className="btn btn-primary gap-2">
                  <Plus className="w-4 h-4" />
                  Browse Problems
                </Link>
                <Link to="/playlist" className="btn btn-outline">
                  View All Playlists
                </Link>
              </div>
            </div>
          ) : (
            /* Problems Table */
            <div className="card bg-base-200 border border-gray-200/10 shadow-lg overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200/10 bg-base-300/50">
                <h3 className="text-lg font-semibold">
                  Problems in this Playlist
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-base-300">
                    <tr>
                      <th className="w-16 text-center">#</th>
                      <th className="w-1/2">Problem</th>
                      <th className="w-32">Difficulty</th>
                      <th className="w-32 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPlaylist.problems.map((p, index) => {
                      const problem = p.problem || p;
                      return (
                        <tr
                          key={problem.id}
                          className="hover:bg-base-300/50 transition-colors border-b border-gray-200/5 last:border-0"
                        >
                          <td className="text-center font-medium text-gray-500">
                            {index + 1}
                          </td>
                          <td>
                            <div className="flex flex-col gap-1">
                              <Link
                                to={`/problem/${problem.id}`}
                                className="text-primary hover:text-primary/80 hover:underline font-semibold text-lg transition-colors"
                              >
                                {problem.title}
                              </Link>
                              {problem.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {problem.tags.slice(0, 4).map((tag) => (
                                    <span
                                      key={tag}
                                      className="text-xs px-2.5 py-1 bg-base-300 rounded-full text-gray-500 dark:text-gray-400"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {problem.tags.length > 4 && (
                                    <span className="text-xs text-gray-500 py-1">
                                      +{problem.tags.length - 4} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${getDifficultyColor(
                                problem.difficulty,
                              )}`}
                            >
                              {problem.difficulty}
                            </span>
                          </td>
                          <td>
                            <div className="flex justify-end gap-2">
                              <Link
                                to={`/problem/${problem.id}`}
                                className="btn btn-ghost btn-sm hover:bg-primary hover:text-primary-content"
                                title="Solve Problem"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleRemoveProblem(problem.id)}
                                className="btn btn-ghost btn-sm hover:bg-error hover:text-error-content text-error"
                                title="Remove from Playlist"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quick Add Problems Section */}
          {allProblems?.length > 0 && currentPlaylist.problems?.length > 0 && (
            <div className="mt-8 p-6 bg-base-200 rounded-2xl border border-gray-200/10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Quick Add Problems
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Suggested problems to add to this playlist:
              </p>
              <div className="flex flex-wrap gap-2">
                {allProblems
                  .filter(
                    (p) =>
                      !currentPlaylist.problems?.some(
                        (pp) => pp.problem?.id === p.id || pp.id === p.id,
                      ),
                  )
                  .slice(0, 8)
                  .map((problem) => (
                    <button
                      key={problem.id}
                      onClick={() => {
                        // Add your add problem logic here
                        // await addProblemToPlaylist(playlistId, problem.id);
                      }}
                      className="btn btn-sm btn-ghost gap-2 hover:bg-base-300 border border-gray-200/10"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          problem.difficulty === "Easy"
                            ? "bg-success"
                            : problem.difficulty === "Medium"
                              ? "bg-warning"
                              : "bg-error"
                        }`}
                      />
                      <span className="truncate max-w-37.5">
                        {problem.title}
                      </span>
                    </button>
                  ))}
              </div>
              <Link to="/problems" className="btn btn-outline btn-sm mt-4">
                View All Problems
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PlaylistPage;
