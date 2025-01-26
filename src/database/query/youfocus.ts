import { Playlist } from '@/database';
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


export {
  addPlaylistToDB,
  checkPlaylistExistsByPlaylistId,
  getPlaylistsFormDB,
}