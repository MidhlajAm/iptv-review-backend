import express from 'express';
import cors from 'cors';
import xtreamRoutes from './routes/xtream.routes';

const app = express();
const PORT = process.env.POupdaye thumbnailRT || 3000;

// CORS enabled for all origins (demo environment)
app.use(cors());

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

// Xtream compatible routes
app.use('/', xtreamRoutes);

// 404 fallback
app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
    console.log(`IPTV Review backend running on port ${PORT}`);
});