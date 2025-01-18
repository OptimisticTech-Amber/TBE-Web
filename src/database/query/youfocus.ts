import { Playlist } from '@/database';
import { PlaylistModel } from '@/interfaces';

// Function to create a playlist in the database
export const addPlaylistToDB = async ({
    playlistId,
    playlistName,
    description,
    videos,
  }: PlaylistModel ) => {
    try {
      await Playlist.create({
        playlistId,
        playlistName,
        description,
        videos,
      });
  
      return { success: true, message: 'Playlist added successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to add playlist', error };
    }
  };

// Check if a playlist exists by its ID
export const checkPlaylistExistsByPlaylistId = async (playlistId: string) => {
  try {
    const existingPlaylist = await Playlist.findOne({ playlistId });
    return existingPlaylist
      ? { exists: true, message: 'Playlist already exists' }
      : { exists: false };
  } catch (error) {
    throw new Error('Error checking playlist existence');
  }
};