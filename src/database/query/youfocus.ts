import { Playlist } from '@/database';
import { DatabaseQueryResponseType, PlaylistModel } from '@/interfaces';


const addPlaylistToDB = async ({
  playlistId,
  playlistName,
  description,
  videos,
}: PlaylistModel): Promise<DatabaseQueryResponseType> => {
  try {
    await Playlist.create({
      playlistId,
      playlistName,
      description,
      videos,
    });
    return { data: { success: true, message: 'Playlist added successfully' } };
  }
  catch (error) {
    return { error };
  }
}


// Check if a playlist exists by its ID
const checkPlaylistExistsByPlaylistId = async (
  playlistId: string
): Promise<DatabaseQueryResponseType> => {
  try {
    const existingPlaylist = await Playlist.findOne({ playlistId });

    if (!existingPlaylist) {
      return { error: 'Playlist does not exist' };
    }

    return { data: existingPlaylist };
  } catch (error) {
    return { error };
  }
};

export {
  addPlaylistToDB,
  checkPlaylistExistsByPlaylistId
}