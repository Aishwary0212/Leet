import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { Folder, Plus, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";

const AllPlaylist = () => {
  const { playlists, getAllPlaylists, isLoading, error } = usePlaylistStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAllPlaylists();
  }, [getAllPlaylists]); // ✅ Ensure getAllPlaylists is memoized in your store

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Failed to load playlists</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <button onClick={() => getAllPlaylists()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              My <span className="text-primary">Playlists</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Organize your practice problems into custom collections
            </p>
          </div>

          {/* Create Playlist Button */}
          <button
            onClick={() => navigate("/playlist/new")}
            className="btn btn-primary gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Create Playlist
          </button>
        </div>

        {/* Empty State */}
        {playlists?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
            <Folder className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
              Create your first playlist to start organizing problems for your
              coding interview prep.
            </p>
            <button
              onClick={() => navigate("/playlist/new")}
              className="btn btn-primary gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First Playlist
            </button>
          </div>
        ) : (
          /* Playlist Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className="group card bg-base-200 hover:bg-base-300 transition-all duration-300 border border-gray-200/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Folder className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="card-title text-lg font-semibold group-hover:text-primary transition-colors">
                        {playlist.name}
                      </h2>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {playlist.problems?.length || 0}{" "}
                      {playlist.problems?.length === 1 ? "Problem" : "Problems"}
                    </p>
                    {playlist.isPublic && (
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        Public
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllPlaylist;
