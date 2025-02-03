import { apiStatusCodes } from '@/constant';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendAPIResponse } from '@/utils';
import { connectDB } from '@/middlewares';
import { getPlaylistByIDFromDB } from '@/database';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  const { query } = req;
  const { youfocusId } = query as { youfocusId: string };

  switch (req.method) {
    case 'GET':
      return handleGetYouFocusById(req, res, youfocusId);
    default:
      return res.status(apiStatusCodes.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: `Method ${req.method} Not Allowed`,
        })
      );
  }
};

const handleGetYouFocusById = async (
  req: NextApiRequest,
  res: NextApiResponse,
  youfocusId: string
) => {
  if (!youfocusId) {
    return res.status(apiStatusCodes.BAD_REQUEST).json(
      sendAPIResponse({
        status: false,
        message: 'YouFocus ID is required',
      })
    );
  }

  const { data, error } = await getPlaylistByIDFromDB(youfocusId);

  if (error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: 'Error fetching YouFocus',
      })
    );
  }

  if (!data) {
    return res.status(apiStatusCodes.NOT_FOUND).json(
      sendAPIResponse({
        status: false,
        message: 'YouFocus not found',
      })
    );
  }

  return res.status(apiStatusCodes.OKAY).json(
    sendAPIResponse({
      status: true,
      message: 'YouFocus fetched successfully',
      data,
    })
  );
};

export default handler;
