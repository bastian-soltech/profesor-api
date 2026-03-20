import { request } from 'undici';
import { catchAsync } from "../utils/catchAsync.js";
import { successResponse } from "../utils/response.js";
import axios from 'axios';

export const StreamingMovieProxy = catchAsync(async (req, res) => {
 try {
        const videoUrl = req.query.url;
        
        const response = await axios({
            method: 'get',
            url: videoUrl,
            responseType: 'stream',
            // Timeout lebih pendek agar tidak menggantung jika server terabox lemot
            timeout: 10000, 
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Referer': 'https://www.4khotvideo.com/',
                'Range': req.headers.range // TERUSKAN Range Header untuk seeking lebih cepat
            }
        });

        // Teruskan status code (misal 206 Partial Content)
        res.status(response.status);
        res.set(response.headers);
        
        // Alirkan data
        response.data.pipe(res);

    } catch (error) {
        if (!res.headersSent) res.status(500).send("Proxy Error");
    }
});
