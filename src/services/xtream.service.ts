import * as users from '../data/users.json';
import * as liveCategories from '../data/live_categories.json';
import * as liveStreams from '../data/live_streams.json';
import * as vodCategories from '../data/vod_categories.json';
import * as vodStreams from '../data/vod_streams.json';
import * as seriesCategories from '../data/series_categories.json';
import * as series from '../data/series.json';
import * as seriesInfoData from '../data/series_info.json';

// Types
interface UserRecord {
    password: string;
    status: string;
    max_connections: string;
}

interface Category {
    category_id: string;
    category_name: string;
}

interface Stream {
    stream_id: number;
    name: string;
    stream_icon: string;
    category_id: string;
    stream_url: string;
    fallback_url?: string;
    license?: string;
    container_extension?: string;
    info?: any;
}

interface SeriesEntry {
    series_id: number;
    name: string;
    cover: string;
    category_id?: string;
    stream_url?: string;
    container_extension?: string;
    fallback_url?: string;
    license?: string;
}

interface SeriesInfo {
    info: Record<string, any>;
    episodes: Record<string, Episode[]>;
}

interface Episode {
    id: string;
    episode_num: string;
    title: string;
    container_extension: string;
    stream_url?: string;
    fallback_url?: string;
    info: {
        duration_secs: number;
        plot: string;
    };
}

const usersDB: Record<string, UserRecord> = users;
const liveStreamsData = liveStreams as Stream[];
const vodStreamsData = vodStreams as Stream[];
const seriesData = series as SeriesEntry[];
const seriesInfoDB: Record<number, SeriesInfo> = seriesInfoData;

/**
 * Validates username/password combination only – does not check status.
 */
export function validateCredentials(username: string, password: string): boolean {
    const user = usersDB[username];
    return user !== undefined && user.password === password;
}

/**
 * Checks if the user exists AND is Active (used for protected endpoints).
 */
export function authenticate(username: string, password: string): boolean {
    if (!validateCredentials(username, password)) return false;
    const user = usersDB[username];
    return user.status === 'Active';
}

/**
 * Returns full user info regardless of status. Used for login response so
 * expired/disabled users are still returned with their actual status.
 */
export function getUserInfo(username: string) {
    const user = usersDB[username];
    if (!user) return null;
    return {
        username,
        password: user.password,
        auth: 1,
        status: user.status,
        exp_date: null,
        is_trial: "0",
        active_cons: "0",
        created_at: "2026-01-01"
    };
}

export function getServerInfo() {
    const baseUrl = process.env.APP_URL || 'localhost:3000';
    const isHttps = baseUrl.startsWith('https');
    return {
        url: baseUrl.replace(/^https?:\/\//, ''),
        port: isHttps ? "443" : "80",
        https_port: "443",
        server_protocol: isHttps ? "https" : "http"
    };
}

export function getLiveCategories(): Category[] {
    return liveCategories as Category[];
}

export function getLiveStreams(categoryId?: string): Stream[] {
    if (!categoryId) return liveStreamsData;
    return liveStreamsData.filter(s => s.category_id === categoryId);
}

export function getVodCategories(): Category[] {
    return vodCategories as Category[];
}

export function getVodStreams(categoryId?: string): Stream[] {
    if (!categoryId) return vodStreamsData;
    return vodStreamsData.filter(s => s.category_id === categoryId);
}

export function getVodInfo(vodId: number): { info: any; movie_data: any } | null {
    const stream = vodStreamsData.find(s => s.stream_id === vodId);
    if (!stream) return null;
    const { info, ...movieData } = stream;
    return { info: info || {}, movie_data: movieData };
}

export function getSeriesCategories(): Category[] {
    return seriesCategories as Category[];
}

export function getSeries(categoryId?: string): SeriesEntry[] {
    if (!categoryId) return seriesData;
    return seriesData.filter(s => s.category_id === categoryId);
}

export function getSeriesInfo(seriesId: number): SeriesInfo | null {
    return seriesInfoDB[seriesId] || null;
}

export function getStreamById(type: 'live' | 'movie', id: number): Stream | undefined {
    if (type === 'live') return liveStreamsData.find(s => s.stream_id === id);
    return vodStreamsData.find(s => s.stream_id === id);
}

export function getEpisodeById(episodeId: string): { url: string; ext: string } | undefined {
    for (const seriesId in seriesInfoDB) {
        const info = seriesInfoDB[seriesId];
        for (const season in info.episodes) {
            const episode = info.episodes[season].find(ep => ep.id === episodeId);
            if (episode) {
                const url = episode.stream_url ||
                    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
                return { url, ext: episode.container_extension };
            }
        }
    }
    return undefined;
}