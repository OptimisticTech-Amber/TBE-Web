import { Playlist, UserPlaylist, User } from '@/database';
import { DatabaseQueryResponseType, PlaylistModel } from '@/interfaces';

// Add a playlist to the database
const addPlaylistToDB = async (
  playlistDetails: PlaylistModel
): Promise<DatabaseQueryResponseType> => {
  try {
    const playlist = new Playlist(playlistDetails);
    await playlist.save();
    return { data: playlist };
  } catch (error) {
    return { error: 'Failed while adding playlist' };
  }
};

// Link a user to a playlist in `UserPlaylist`
const addUserPlaylistEntry = async (
  userId: string,
  playlistId: string
): Promise<DatabaseQueryResponseType> => {
  try {
    // Check if Userplaylist exists
    const existingUserPlaylist = await UserPlaylist.findOne({
      userId,
      playlistId,
    });
    if (existingUserPlaylist) {
      return { error: 'UserPlaylist already exists' };
    }
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return { error: 'User not found' };
    }
    const userPlaylist = new UserPlaylist({
      userId,
      playlistId,
    });

    await userPlaylist.save();
    return { data: userPlaylist };
  } catch (error) {
    return { error: 'Failed to link playlist to user' };
  }
};

// Check if a playlist exists by its ID
const checkPlaylistExistsByPlaylistId = async (
  playlistId: string
): Promise<DatabaseQueryResponseType> => {
  try {
    const existingPlaylist = await Playlist.findOne({ playlistId });

    if (!existingPlaylist) {
      return { error: 'Playlist does not exist' };
    }
    // Increment referrerBy only if playlist is found
    existingPlaylist.referrerBy = (existingPlaylist.referrerBy || 0) + 1;
    await existingPlaylist.save();

    return { data: existingPlaylist };
  } catch (error) {
    return { error };
  }
};

// Get Allplaylist data FormDB
const getPlaylistsFormDB = async (): Promise<DatabaseQueryResponseType> => {
  try {
    const playlists = await Playlist.find();
    return { data: playlists };
  } catch (error) {
    return { error };
  }
};

// Get a playlist by its ID
const getPlaylistByIDFromDB = async (
  playlistId: string
): Promise<DatabaseQueryResponseType> => {
  try {
    const playlist = await Playlist.findById({ _id: playlistId });

    if (!playlist) {
      return { error: 'Playlist not found' };
    }

    return { data: playlist };
  } catch (error) {
    return { error };
  }
};

// Get Playlist Video my Id Form DB
const getPlaylistVideoByIDFromDB = async (
  videoId: string
): Promise<DatabaseQueryResponseType> => {
  try {
    const playlist = await Playlist.findOne({ "videos.videoId": videoId });

    if (!playlist) {
      return { error: "Video not found in any playlist" };
    }

    // Find the specific video in the playlist
    const video = playlist.videos.find((v) => v.videoId === videoId);

    return { data: video };
  } catch (error) {
    return { error: "An error occurred while fetching video" };
  }
};


// Get all playlists of a user  from `UserPlaylist`
const getUserPlaylistsFromDB = async (
  userId: string
): Promise<DatabaseQueryResponseType> => {
  try {
    const userPlaylists = await UserPlaylist.find({ userId }).populate(
      'playlistId'
    );

    if (userPlaylists.length === 0) {
      return { error: 'User does not have any playlists' };
    }

    return { data: userPlaylists };
  } catch (error) {
    return { error: 'An error occurred while fetching playlists' };
  }
};

// Delete a userPlaylist form DB
const deleteUserPlaylistFromDB = async (
  userId: string,
  playlistId: string
): Promise<DatabaseQueryResponseType> => {
  try {
    const userPlaylist = await UserPlaylist.findOneAndDelete({
      userId,
      playlistId,
    });
    if (!userPlaylist) {
      return { error: 'UserPlaylist not found' };
    }
    return { data: userPlaylist };
  } catch (error) {
    return { error: 'An error occurred while deleting userPlaylist' };
  }
};

const updateUserPlaylistWatchTime = async (userId: string, playlistId: string, time: { minutes: number; seconds: number }) => {
  try {
    const updatedPlaylist = await UserPlaylist.findOneAndUpdate(
      { userId, playlistId },
      { $set: { timeWatched: time } }, // Explicitly set timeWatched
      { new: true, upsert: true } // Ensures update works & creates if not exist
    ).lean();

    if (!updatedPlaylist) {
      return { error: true, message: 'UserPlaylist not found' };
    }

    return { error: false, data: updatedPlaylist };
  } catch (error) {
    console.error('Error updating timeWatched:', error);
    return { error: true, message: 'Database error' };
  }
};


export {
  addPlaylistToDB,
  checkPlaylistExistsByPlaylistId,
  addUserPlaylistEntry,
  getPlaylistsFormDB,
  getPlaylistByIDFromDB,
  getUserPlaylistsFromDB,
  deleteUserPlaylistFromDB,
  getPlaylistVideoByIDFromDB,
  updateUserPlaylistWatchTime,
};
