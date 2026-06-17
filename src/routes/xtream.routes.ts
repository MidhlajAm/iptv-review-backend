import { Router } from 'express';
import * as controller from '../controllers/xtream.controller';

const router = Router();

// Main player_api endpoint
router.get('/player_api.php', (req, res) => {
    const action = req.query.action;
    if (!action) {
        return controller.authenticateUser(req, res);
    }

    switch (action) {
        case 'get_live_categories':
            return controller.getLiveCategories(req, res);
        case 'get_live_streams':
            return controller.getLiveStreams(req, res);
        case 'get_vod_categories':
            return controller.getVodCategories(req, res);
        case 'get_vod_streams':
            return controller.getVodStreams(req, res);
        case 'get_vod_info':
            return controller.getVodInfo(req, res);
        case 'get_series_categories':
            return controller.getSeriesCategories(req, res);
        case 'get_series':
            return controller.getSeries(req, res);
        case 'get_series_info':
            return controller.getSeriesInfo(req, res);
        default:
            return controller.authenticateUser(req, res);
    }
});

// Streaming URLs
router.get('/live/:username/:password/:streamId.ts', controller.redirectLiveStream);
router.get('/movie/:username/:password/:streamId.:ext', controller.redirectMovie);
router.get('/series/:username/:password/:episodeId.:ext', controller.redirectSeries);

export default router;