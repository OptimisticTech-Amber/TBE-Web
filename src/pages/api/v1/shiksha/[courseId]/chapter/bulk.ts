import { apiStatusCodes } from '@/constant';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendAPIResponse } from '@/utils';
import { connectDB } from '@/middlewares';
import { AddChapterToCourseRequestProps } from '@/interfaces';
import { addChapterToCourseInDB } from '@/database';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  const { method, query } = req;
  const { courseId } = query as { courseId: string };

  switch (method) {
    case 'POST':
      return handleAddBulkChapters(req, res, courseId);
    default:
      return res.status(apiStatusCodes.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: `Method ${req.method} Not Allowed`,
        })
      );
  }
};

const handleAddBulkChapters = async (
  req: NextApiRequest,
  res: NextApiResponse,
  courseId: string
) => {
  const { chaptersData } = req.body;

  try {
    for (const chapterData of chaptersData as AddChapterToCourseRequestProps[]) {
      const { error } = await addChapterToCourseInDB(courseId, chapterData);

      if (error) {
        return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
          sendAPIResponse({
            status: false,
            message: 'Failed while adding chapter to course',
            error,
          })
        );
      }
    }

    return res.status(apiStatusCodes.OKAY).json(
      sendAPIResponse({
        status: true,
        message: 'All Chapters added to course successfully',
      })
    );
  } catch (error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: 'Failed while adding chapter to course',
        error,
      })
    );
  }
};

export default handler;
