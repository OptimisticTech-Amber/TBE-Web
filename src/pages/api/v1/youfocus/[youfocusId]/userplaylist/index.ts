import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/middlewares";
import { apiStatusCodes } from "@/constant";
import { sendAPIResponse } from "@/utils";
import { getUserPlaylistsFromDB } from "@/database";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();

    const { method, query } = req;
    const { userId } = query as { userId: string };

    if (!userId) {
        return res.status(apiStatusCodes.BAD_REQUEST).json({
            success: false,
            message: "userId is required in the URL"
        });
    }

    switch (method) {
        case "GET":
            return handleGetUserPlaylists(req, res, userId);
        default:
            return res.status(apiStatusCodes.BAD_REQUEST).json({
                success: false,
                message: `Method ${method} not allowed`
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

        if (!userPlaylists) {
            return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Failed while fetching user playlists",
            })
        }

        return res.status(apiStatusCodes.OKAY).json(
            sendAPIResponse({
                status: true,
                message: "User playlists retrieved successfully",
                data: userPlaylists.data
            })
        );
    } catch (error) {
        return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
            sendAPIResponse({
                status: false,
                message: "Error fetching user playlists",
                error
            })
        );
    }
};

export default handler;
