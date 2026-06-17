import { Request, Response } from 'express';
import * as service from '../services/xtream.service';

export function authenticateUser(req: Request, res: Response) {
    const { username, password } = req.query;

    if (!username || !password || !service.validateCredentials(username as string, password as string)) {
        // Invalid credentials → auth: 0
        return res.json({ user_info: { auth: 0 } });
    }

    // Valid credentials – return full user_info, even if not Active
    const userInfo = service.getUserInfo(username as string);
    const serverInfo = service.getServerInfo();
    return res.json({ user_info: userInfo, server_info: serverInfo });
}

export function getLiveCategories(req: Request, res: Response) {
    if (!checkAuth(req, res)) return;
    return res.json(service.getLiveCategories());
}

export function getLiveStreams(req: Request, res: Response) {
    if (!checkAuth(req, res)) return;
    const categoryId = req.query.category_id as string | undefined;
    return res.json(service.getLiveStreams(categoryId));
}

export function getVodCategories(req: Request, res: Response) {
    if (!checkAuth(req, res)) return;
    return res.json(service.getVodCategories());
}

export function getVodStreams(req: Request, res: Response) {
    if (!checkAuth(req, res)) return;
    const categoryId = req.query.category_id as string | undefined;
    return res.json(service.getVodStreams(categoryId));
}

export function getVodInfo(req: Request, res: Response) {
    if (!checkAuth(req, res)) return;
    const vodId = req.query.vod_id as string;
    if (!vodId) return res.status(400).json({ error: 'vod_id is required' });
    const info = service.getVodInfo(Number(vodId));
    if (!info) return res.status(404).json({ error: 'VOD not found' });
    return res.json(info);
}

export function getSeriesCategories(req: Request, res: Response) {
    if (!checkAuth(req, res)) return;
    return res.json(service.getSeriesCategories());
}

export function getSeries(req: Request, res: Response) {
    if (!checkAuth(req, res)) return;
    const categoryId = req.query.category_id as string | undefined;
    return res.json(service.getSeries(categoryId));
}

export function getSeriesInfo(req: Request, res: Response) {
    if (!checkAuth(req, res)) return;
    const seriesId = req.query.series_id as string;
    if (!seriesId) return res.status(400).json({ error: 'series_id is required' });
    const info = service.getSeriesInfo(Number(seriesId));
    if (!info) return res.status(404).json({ error: 'Series not found' });
    return res.json(info);
}

// Stream redirection endpoints – only Active users can access
export function redirectLiveStream(req: Request, res: Response) {
    const { username, password, streamId } = req.params;
    if (!service.authenticate(username, password)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const stream = service.getStreamById('live', Number(streamId));
    if (!stream || !stream.stream_url) {
        return res.status(404).json({ error: 'Stream not found' });
    }
    return res.redirect(302, stream.stream_url);
}

export function redirectMovie(req: Request, res: Response) {
    const { username, password, streamId } = req.params;
    if (!service.authenticate(username, password)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const movie = service.getStreamById('movie', Number(streamId));
    if (!movie || !movie.stream_url) {
        return res.status(404).json({ error: 'Movie not found' });
    }
    return res.redirect(302, movie.stream_url);
}

export function redirectSeries(req: Request, res: Response) {
    const { username, password, episodeId } = req.params;
    if (!service.authenticate(username, password)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const episode = service.getEpisodeById(episodeId);
    if (!episode) {
        return res.status(404).json({ error: 'Episode not found' });
    }
    return res.redirect(302, episode.url);
}

/**
 * For protected endpoints: only users with status exactly 'Active' are allowed.
 */
function checkAuth(req: Request, res: Response): boolean {
    const { username, password } = req.query;
    if (!username || !password || !service.authenticate(username as string, password as string)) {
        res.status(401).json({ user_info: { auth: 0 } });
        return false;
    }
    return true;
}