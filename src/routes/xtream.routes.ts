import { Router } from 'express';
import * as controller from '../controllers/xtream.controller';

const router = Router();

// Main player_api endpoint – action based
router.get('/player_api.php', (req, res) => {
    const action = req.query.action;
    if (!action) {
        // Default: authentication
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
        case 'get_series_categories':
            return controller.getSeriesCategories(req, res);
        case 'get_series':
            return controller.getSeries(req, res);
        default:
            // Unrecognized action – treat as auth
            return controller.authenticateUser(req, res);
    }
});

// Direct stream redirects
router.get('/live/:username/:password/:streamId.ts', controller.redirectLiveStream);
router.get('/movie/:username/:password/:streamId.mp4', controller.redirectMovie);
router.get('/series/:username/:password/:seriesId.mp4', controller.redirectSeries);

export default router;