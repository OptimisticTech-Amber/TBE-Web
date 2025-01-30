import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/middlewares';
import { apiStatusCodes } from '@/constant';
import { sendAPIResponse } from '@/utils';
import {
  extractPlaylistId,
  fetchPlaylistData
}
  from '@/utils';
import { checkPlaylistExistsByPlaylistId, addPlaylistToDB, getPlaylistsFormDB, addUserPlaylistEntry } from '@/database';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  const { method, query } = req;
  const { userId } = query as { userId: string };

  switch (req.method) {
    case 'POST':
      return handleAddPlaylist(req, res, userId);
    case 'GET':
      return handleGetPlaylists(req, res);
    default:
      return res.status(apiStatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Method ${req.method} not allowed`,
      });
  }
};

const handleAddPlaylist = async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  const { playlistUrl } = req.body;

  const playlistId = extractPlaylistId(playlistUrl);

  if (!playlistId) {
    return res.status(apiStatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid playlist URL',
    });
  }

  const { data: existingPlaylist } = await checkPlaylistExistsByPlaylistId(playlistId);

  if (existingPlaylist) {
    return res.status(apiStatusCodes.RESOURCE_CREATED).json(
      sendAPIResponse({
        status: true,
        message: 'Playlist already exists',
        data: existingPlaylist,
      })
    );
  }

   // Fetch playlist data from YouTube
   try {
    const playlistData = await fetchPlaylistData(playlistId);

    if (!playlistData) {
      return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to fetch playlist data from YouTube',
      });
    }

    // Add playlist to the database
    const { error, data: newPlaylist } = await addPlaylistToDB(playlistData);

    if (error) {
      return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          message: 'Failed to add playlist',
          error,
        })
      );
    }
    
    const { error: userPlaylistError } = await addUserPlaylistEntry(userId, newPlaylist._id);

    if (userPlaylistError) {
      return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Failed to link user and playlist',
        error: userPlaylistError,
      });
    }
   

    return res.status(apiStatusCodes.RESOURCE_CREATED).json(
      sendAPIResponse({
        status: true,
        message: 'Playlist added successfully!',
        data: newPlaylist,
      })
    );
  } catch (error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'An unexpected error occurred',
      error,
    });
  }
};

const handleGetPlaylists = async (req:NextApiRequest, res:NextApiResponse) => {
  const { data, error} = await getPlaylistsFormDB();

  if (error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching playlists',
      error,
    });
  }

  return res.status(apiStatusCodes.OKAY).json(
    sendAPIResponse({
      status: true,
      message: 'playlists fetched successfully',
      data,
    })
  );
}


export default handler;
