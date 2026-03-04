import { db } from "../libs/db.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });
    return res.status(200).json({
      success: true,
      messgae: "Playlist Created Successfully",
      playlist,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error while creating playlist" });
  }
};

export const getAllListDetails = async (req, res) => {
  try {
    const playlists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      messgae: "Playlist Fetched Successfully",
      playlists,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error while fetching playlist" });
  }
};

export const getPlaylistDetails = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.status(200).json({
      success: true,
      messgae: "Playlist Fetched Successfully",
      playlist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error while fetching playlist" });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or Missing problemsId" });
    }
    const problemsInPlaylist = await db.ProblemsInPlayList.createMany({
      data: problemIds.map((problemId) => ({
        playListId:playlistId,
        problemId,
      })),
    });
    res.status(201).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemsInPlaylist,
    });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error while adding problems to playlist" });
  }
};

export const deletePlaylist = async (req, res) => {
    const { playlistId } = req.params;
    try {
        const deletedPlaylist = await db.playlist.delete({
            where: {
                id: playlistId,
            }
        })
        res.status(200).json({
            success: true,
            message: "Playlist deleted successfully",
            deletedPlaylist
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error while deleting playlist" });
    }
};

export const removeProblemFromPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body;
    try {
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({ error: "Invalid or Missing problemsId" });
        }
        const deletedProblem = await db.ProblemsInPlayList.deleteMany({
          where: {
            playListId: playlistId,
            problemId: {
              in: problemIds,
            },
          },
        });
        res.status(200).json({
            success: true,
            message: "Problems removed from playlist successfully",
            deletedProblem
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error while removing problems from playlist" });
    }
};
