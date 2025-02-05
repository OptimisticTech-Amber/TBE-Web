import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/middlewares';
import { apiStatusCodes } from '@/constant';
import { sendAPIResponse } from '@/utils';
import { 
  getUserPlaylistsFromDB,
  deleteUserPlaylistFromDB,
  updateUserPlaylistWatchTime,
} from '@/database';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  const { method, query } = req;
  const { userId, playlistId } = query as {
    userId: string,
    playlistId: string
  };

  switch (method) {
    case 'POST':
      return handleUserPlaylistTime(req, res, userId, playlistId);
    case 'GET':
      return handleGetUserPlaylists(req, res, userId);
    case 'DELETE':
      return handleDeleteUserPlaylist(req, res, userId, playlistId);
    default:
      return res.status(apiStatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Method ${method} not allowed`,
      });
  }
};

const handleGetUserPlaylists = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  try {
    const userPlaylists = await getUserPlaylistsFromDB(userId);

    if (userPlaylists.error) {
      return res.status(apiStatusCodes.NOT_FOUND).json(
        sendAPIResponse({
          status: false,
          message: 'User does not have any playlists',
        })
      );
    }

    return res.status(apiStatusCodes.OKAY).json(
      sendAPIResponse({
        status: true,
        message: 'User playlists retrieved successfully',
        data: userPlaylists.data,
      })
    );
  } catch (error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: 'Error fetching user playlists',
        error,
      })
    );
  }
};

const handleDeleteUserPlaylist = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  playlistId: string
) => {
  try {
    const deleteResponse = await deleteUserPlaylistFromDB(userId, playlistId);
    
    if (deleteResponse.error) {
      return res.status(apiStatusCodes.NOT_FOUND).json(
        sendAPIResponse({
          status: false,
          message: 'UserPlaylist not found',
        })
      );
    }
    
    return res.status(apiStatusCodes.OKAY).json(
      sendAPIResponse({
        status: true,
        message: 'User playlist deleted successfully',
      })
    );
    
  } catch (error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: 'Error deleting user playlist',
        error,
      })
    );
  }
};

const handleUserPlaylistTime = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  playlistId: string
) => {
  const { minutes = 0, seconds = 0 } = req.body;

  try {
    const updateResponse = await updateUserPlaylistWatchTime(
      userId,
      playlistId,
      { minutes, seconds }
    );

    if (updateResponse.error) {
      return res.status(apiStatusCodes.NOT_FOUND).json(
        sendAPIResponse({
          status: false,
          message: 'UserPlaylist not found',
        })
      );
    }
    
    return res.status(apiStatusCodes.OKAY).json(
      sendAPIResponse({
        status: true,
        message: 'User playlist time updated successfully',
        data: updateResponse.data, // Return updated data for debugging
      })
    );

  } catch (error) {

    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: 'Error updating user playlist time',
        error,
      })
    );
  }
};




export default handler;
