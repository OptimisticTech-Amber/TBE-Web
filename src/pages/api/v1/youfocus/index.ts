import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/middlewares';
import { apiStatusCodes } from '@/constant';
import { addPlaylist } from '@/utils';

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
  try {
    const { playlistUrl }: { playlistUrl: string } = req.body;

    if (!playlistUrl) {
      return res.status(apiStatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Playlist URL is required',
      });
    }

    const message = await addPlaylist(playlistUrl);

    return res.status(apiStatusCodes.RESOURCE_CREATED).json({
      success: true,
      message,
    });
  } catch (error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to add playlist Check your Playlist URL.',
      error: error,
    });
  }
};

export default handler;
