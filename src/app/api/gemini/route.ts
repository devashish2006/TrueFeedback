import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method, endpoint, data } = req.body; // Extract request payload
    
    if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_API_BASE_URL) {
        return res.status(500).json({ error: 'Missing API configuration' });
    }

    try {
        const response = await axios({
            method: method || 'GET',
            url: `${process.env.GEMINI_API_BASE_URL}${endpoint}`,
            headers: {
                Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
            },
            data: data || null,
        });

        res.status(200).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json({
            error: error.message,
            details: error.response?.data,
        });
    }
}
