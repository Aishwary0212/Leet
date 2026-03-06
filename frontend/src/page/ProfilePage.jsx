import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useProblemStore } from "../store/useProblemStore";
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Target,
  BookOpen,
  Clock,
  TrendingUp,
  Edit2,
  Save,
  X,
  Award,
  Flame,
  Star,
  ChevronRight,
  LogOut,
  Settings,
  Shield,
  Bell,
  Key,
} from "lucide-react";
import Navbar from "../components/Navbar";
import LogoutButton from "../components/LogoutButton";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore(); // Removed updateProfile
  const { playlists } = usePlaylistStore();
  const { problems } = useProblemStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    github: "",
    linkedin: "",
    twitter: "",
  });

  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || "",
        bio: authUser.bio || "",
        github: authUser.github || "",
        linkedin: authUser.linkedin || "",
        twitter: authUser.twitter || "",
      });
    }
  }, [authUser]);

  // Calculate statistics (Replace with actual API data when available)
  const stats = {
    problemsSolved: 25, // TODO: Fetch from backend
    easySolved: 12,
    mediumSolved: 10,
    hardSolved: 3,
    playlistsCreated: playlists?.length || 0,
    totalSubmissions: 75,
    acceptanceRate: 78,
    currentStreak: 5,
    longestStreak: 12,
    ranking: 4523,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: Add API call when backend is ready
    // await updateProfile(formData);

    // For now, just show success message and close edit mode
    alert(
      "Profile update feature coming soon! Backend API not yet implemented.",
    );
    setIsEditing(false);

    // Optionally update local state (won't persist after refresh)
    // setFormData(formData);
  };

  const handleCancel = () => {
    setFormData({
      name: authUser.name || "",
      bio: authUser.bio || "",
      github: authUser.github || "",
      linkedin: authUser.linkedin || "",
      twitter: authUser.twitter || "",
    });
    setIsEditing(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-success bg-success/10";
      case "medium":
        return "text-warning bg-warning/10";
      case "hard":
        return "text-error bg-error/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  // Recent activity (Replace with actual API data when available)
  const recentActivity = [
    {
      id: 1,
      action: "Solved",
      problem: "Add Two Numbers",
      difficulty: "Easy",
      date: "2 hours ago",
    },
    {
      id: 2,
      action: "Created",
      problem: "New Playlist: Arrays",
      difficulty: null,
      date: "5 hours ago",
    },
    {
      id: 3,
      action: "Solved",
      problem: "Reverse String",
      difficulty: "Easy",
      date: "1 day ago",
    },
    {
      id: 4,
      action: "Attempted",
      problem: "Two Sum",
      difficulty: "Medium",
      date: "2 days ago",
    },
  ];

  if (!authUser) {
    return (
      <div className="min-h-screen flex flex-col bg-base-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="card bg-base-200 border border-gray-200/10 shadow-lg mb-8">
            <div className="card-body p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-primary/20 shadow-lg">
                    <img
                      src={
                        authUser.image ||
                        "https://api.dicebear.com/9.x/pixel-art/svg?seed=" +
                          authUser.name
                      }
                      alt={authUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {authUser.role === "ADMIN" && (
                    <div
                      className="absolute -top-2 -right-2 bg-primary text-white p-1.5 rounded-full"
                      title="Admin"
                    >
                      <Shield className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-base-content">
                          {authUser.name}
                        </h1>
                        {authUser.role === "ADMIN" && (
                          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wide">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {authUser.email}
                      </p>
                      {authUser.bio && (
                        <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl">
                          {authUser.bio}
                        </p>
                      )}
                    </div>

                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-outline gap-2 self-start md:self-auto"
                        title="Edit profile (Backend API coming soon)"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2 self-start md:self-auto">
                        <button
                          onClick={handleSave}
                          className="btn btn-primary gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="btn btn-ghost gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Edit Form */}
                  {isEditing && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-base-100 rounded-xl border border-gray-200/10">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Name</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="input input-bordered w-full"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="form-control md:col-span-2">
                        <label className="label">
                          <span className="label-text font-semibold">Bio</span>
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          className="textarea textarea-bordered w-full"
                          placeholder="Tell us about yourself..."
                          rows="3"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            GitHub
                          </span>
                        </label>
                        <input
                          type="url"
                          name="github"
                          value={formData.github}
                          onChange={handleInputChange}
                          className="input input-bordered w-full"
                          placeholder="https://github.com/username"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            LinkedIn
                          </span>
                        </label>
                        <input
                          type="url"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          className="input input-bordered w-full"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div className="form-control md:col-span-2">
                        <label className="label">
                          <span className="label-text text-warning text-xs">
                            ⚠️ Changes won't persist until backend API is
                            implemented
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Social Links (View Mode) */}
                  {!isEditing &&
                    (formData.github ||
                      formData.linkedin ||
                      formData.twitter) && (
                      <div className="flex flex-wrap gap-4 mt-4">
                        {formData.github && (
                          <a
                            href={formData.github}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            <span className="text-sm">GitHub</span>
                          </a>
                        )}
                        {formData.linkedin && (
                          <a
                            href={formData.linkedin}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                            <span className="text-sm">LinkedIn</span>
                          </a>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Problems Solved */}
            <div className="card bg-base-200 border border-gray-200/10 shadow-lg">
              <div className="card-body p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Problems Solved
                    </p>
                    <p className="text-3xl font-bold text-primary mt-1">
                      {stats.problemsSolved}
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="px-2 py-1 bg-success/10 text-success text-xs rounded font-semibold">
                    {stats.easySolved} Easy
                  </span>
                  <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded font-semibold">
                    {stats.mediumSolved} Medium
                  </span>
                  <span className="px-2 py-1 bg-error/10 text-error text-xs rounded font-semibold">
                    {stats.hardSolved} Hard
                  </span>
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="card bg-base-200 border border-gray-200/10 shadow-lg">
              <div className="card-body p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Current Streak
                    </p>
                    <p className="text-3xl font-bold text-warning mt-1">
                      {stats.currentStreak} days
                    </p>
                  </div>
                  <div className="p-3 bg-warning/10 rounded-xl">
                    <Flame className="w-6 h-6 text-warning" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Longest: {stats.longestStreak} days
                </p>
              </div>
            </div>

            {/* Acceptance Rate */}
            <div className="card bg-base-200 border border-gray-200/10 shadow-lg">
              <div className="card-body p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Acceptance Rate
                    </p>
                    <p className="text-3xl font-bold text-success mt-1">
                      {stats.acceptanceRate}%
                    </p>
                  </div>
                  <div className="p-3 bg-success/10 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  {stats.totalSubmissions} total submissions
                </p>
              </div>
            </div>

            {/* Ranking */}
            <div className="card bg-base-200 border border-gray-200/10 shadow-lg">
              <div className="card-body p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Global Ranking
                    </p>
                    <p className="text-3xl font-bold text-error mt-1">
                      #{stats.ranking.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-error/10 rounded-xl">
                    <Trophy className="w-6 h-6 text-error" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Top {Math.floor((stats.ranking / 100000) * 100)}%
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Recent Activity & Playlists */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Activity */}
              <div className="card bg-base-200 border border-gray-200/10 shadow-lg">
                <div className="card-body p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Recent Activity
                  </h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 bg-base-100 rounded-xl border border-gray-200/5 hover:border-primary/20 transition-colors"
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            activity.action === "Solved"
                              ? "bg-success/10 text-success"
                              : activity.action === "Created"
                                ? "bg-primary/10 text-primary"
                                : "bg-warning/10 text-warning"
                          }`}
                        >
                          {activity.action === "Solved" ? (
                            <Trophy className="w-4 h-4" />
                          ) : activity.action === "Created" ? (
                            <BookOpen className="w-4 h-4" />
                          ) : (
                            <Target className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">
                            {activity.action}
                            <span className="text-primary">
                              {" "}
                              "{activity.problem}"
                            </span>
                          </p>
                          {activity.difficulty && (
                            <span
                              className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${getDifficultyColor(activity.difficulty)}`}
                            >
                              {activity.difficulty}
                            </span>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-outline btn-sm mt-4 w-full">
                    View All Activity
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>

              {/* Playlists */}
              <div className="card bg-base-200 border border-gray-200/10 shadow-lg">
                <div className="card-body p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      My Playlists
                    </h2>
                    <button
                      onClick={() => navigate("/playlist")}
                      className="btn btn-primary btn-sm gap-2"
                    >
                      <span className="hidden sm:inline">View All</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  {playlists?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {playlists.slice(0, 4).map((playlist) => (
                        <div
                          key={playlist.id}
                          onClick={() => navigate(`/playlist/${playlist.id}`)}
                          className="p-4 bg-base-100 rounded-xl border border-gray-200/5 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                              {playlist.name}
                            </h3>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {playlist.problems?.length || 0} problems
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No playlists yet</p>
                      <button
                        onClick={() => navigate("/playlist/new")}
                        className="btn btn-primary btn-sm mt-3"
                      >
                        Create Your First Playlist
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Account Settings */}
            <div className="space-y-8">
              {/* Account Settings */}
              <div className="card bg-base-200 border border-gray-200/10 shadow-lg">
                <div className="card-body p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Account Settings
                  </h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-ghost w-full justify-start gap-3 hover:bg-base-300"
                    >
                      <User className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button
                      className="btn btn-ghost w-full justify-start gap-3 hover:bg-base-300 opacity-50 cursor-not-allowed"
                      title="Coming soon"
                    >
                      <Mail className="w-4 h-4" />
                      Change Email
                    </button>
                    <button
                      className="btn btn-ghost w-full justify-start gap-3 hover:bg-base-300 opacity-50 cursor-not-allowed"
                      title="Coming soon"
                    >
                      <Key className="w-4 h-4" />
                      Change Password
                    </button>
                    <button
                      className="btn btn-ghost w-full justify-start gap-3 hover:bg-base-300 opacity-50 cursor-not-allowed"
                      title="Coming soon"
                    >
                      <Bell className="w-4 h-4" />
                      Notifications
                    </button>
                    <hr className="border-gray-200/10 my-2" />
                    <LogoutButton className="btn btn-error w-full justify-start gap-3 hover:bg-error/90">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </LogoutButton>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="card bg-base-200 border border-gray-200/10 shadow-lg">
                <div className="card-body p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Achievements
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                      <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">First Problem</p>
                        <p className="text-xs text-gray-500">
                          Solved your first problem
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                      <div className="p-2 bg-success/10 rounded-lg">
                        <Flame className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">7-Day Streak</p>
                        <p className="text-xs text-gray-500">
                          Practiced for 7 days straight
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg opacity-50">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Trophy className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Problem Solver</p>
                        <p className="text-xs text-gray-500">
                          Solve 50 problems
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
