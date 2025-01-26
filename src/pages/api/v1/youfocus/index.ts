import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/middlewares';
import { apiStatusCodes } from '@/constant';
import { sendAPIResponse } from '@/utils';
import {
  extractPlaylistId,
  fetchPlaylistData
}
  from '@/utils';
import { checkPlaylistExistsByPlaylistId, addPlaylistToDB, getPlaylistsFormDB } from '@/database';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  switch (req.method) {
    case 'POST':
      return handleAddPlaylist(req, res);
    case 'GET':
      return handleGetPlaylists(req, res);
    default:
      return res.status(apiStatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Method ${req.method} not allowed`,
      });
  }
};

const handleAddPlaylist = async (req: NextApiRequest, res: NextApiResponse) => {
  const { playlistUrl } = req.body;

  const playlistId = extractPlaylistId(playlistUrl);

  if (!playlistId) {
    return res.status(apiStatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid playlist URL',
    });
  }

  const { error: playlistAlreadyExists, data } = await checkPlaylistExistsByPlaylistId(playlistId);

  if (!playlistAlreadyExists) {
    return res.status(apiStatusCodes.RESOURCE_CREATED).json(
      sendAPIResponse({
        status: true,
        message: 'Playlist already exists',
        data
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
    const { error, data } = await addPlaylistToDB(playlistData);

    if (error) {
      return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          message: 'Failed to add playlist',
          error,
        })
      );
    }

    return res.status(apiStatusCodes.RESOURCE_CREATED).json(
      sendAPIResponse({
        status: true,
        message: 'Playlist added successfully!',
        data,
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
