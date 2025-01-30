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
}


export {
  addPlaylistToDB,
  checkPlaylistExistsByPlaylistId,
  addUserPlaylistEntry,
  getPlaylistsFormDB,
  getPlaylistByIDFromDB,
}