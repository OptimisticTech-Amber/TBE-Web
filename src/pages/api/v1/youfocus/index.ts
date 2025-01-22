import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/middlewares';
import { apiStatusCodes } from '@/constant';
import { sendAPIResponse } from '@/utils';
import {
  extractPlaylistId,
  fetchPlaylistMetadata,
  fetchPlaylistVideos
}
  from '@/utils';
import { checkPlaylistExistsByPlaylistId, addPlaylistToDB } from '@/database';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  switch (req.method) {
    case 'POST':
      return handleAddPlaylist(req, res);
    default:
      return res.status(apiStatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Method ${req.method} not allowed`,
      });
  }
};

const handleAddPlaylist = async (req: NextApiRequest, res: NextApiResponse) => {
  const { playlistUrl }: { playlistUrl: string } = req.body;

  if (!playlistUrl) {
    return res.status(apiStatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Playlist URL is required',
    });
  }

  const playlistId = extractPlaylistId(playlistUrl);

  if (!playlistId) {
    return res.status(apiStatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid playlist URL',
    });
  }

  const { error: playlistAlreadyExists } = await checkPlaylistExistsByPlaylistId(playlistId);

  if (!playlistAlreadyExists) {
    return res.status(apiStatusCodes.BAD_REQUEST).json(
      sendAPIResponse({
        status: false,
        message: 'Playlist already exists',
      })
    );
  }

  const metadata = await fetchPlaylistMetadata(playlistId);

  if (!metadata || metadata.success === false) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch playlist metadata from YouTube',
    });
  }

  const videos = await fetchPlaylistVideos(playlistId);

  const { data, error } = await addPlaylistToDB({
    playlistId,
    playlistName: metadata.playlistName,
    description: metadata.description,
    videos,
  });

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
};


export default handler;
