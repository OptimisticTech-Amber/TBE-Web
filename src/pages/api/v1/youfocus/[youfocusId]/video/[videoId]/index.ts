import { NextApiRequest, NextApiResponse } from "next";
import { sendAPIResponse } from "@/utils";
import { connectDB } from "@/middlewares";
import { apiStatusCodes } from "@/constant"; 
import { getPlaylistVideoByIDFromDB } from "@/database";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    const { query } = req;
    const { videoId } = query as { videoId: string };

    switch (req.method) {
        case 'GET':
          return GetPlaylistVideoById(req, res, videoId);
        default:
          return res.status(apiStatusCodes.BAD_REQUEST).json(
            sendAPIResponse({
              status: false,
              message: `Method ${req.method} Not Allowed`,
            })
          );
      }
    };

const GetPlaylistVideoById = async (
    req: NextApiRequest,
    res: NextApiResponse,
    videoId: string
) => {
    if (!videoId) {
        return res.status(apiStatusCodes.BAD_REQUEST).json(
            sendAPIResponse({
                status: false,
                message: "Video ID is required",
            })
        );
    }
    const { data, error } = await getPlaylistVideoByIDFromDB(videoId);
    if (error) {
        return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
            sendAPIResponse({
                status: false,
                message: "Error fetching video",
            })
        );
    }
    if (!data) {
        return res.status(apiStatusCodes.NOT_FOUND).json(
            sendAPIResponse({
                status: false,
                message: "Video not found",
            })
        );
    }
    return res.status(apiStatusCodes.OKAY).json(
        sendAPIResponse({
            status: true,
            message: "Video fetched successfully",
            data,
        })
    );

};  
export default handler;