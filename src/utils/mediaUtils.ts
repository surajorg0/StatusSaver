import Saf from '../plugins/Saf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { differenceInDays } from 'date-fns';

declare global {
    interface Window {
        Ionic: any;
    }
}

export type StatusMedia = {
    id: string;
    name: string;
    uri: string;
    thumbnail?: string;
    originalUri: string;
    size: number;
    lastModified: number;
    type: 'image/jpeg' | 'image/png' | 'image/gif' | 'video/mp4' | string;
    isCached: boolean;
    appType: 'wa' | 'wab';
};

const CACHE_DIR = 'status-cache';

export const initializeCache = async () => {
    try {
        await Filesystem.mkdir({
            path: CACHE_DIR,
            directory: Directory.Cache,
            recursive: true,
        });
    } catch (e) {
        // Directory might already exist
    }
};

export const fetchStatuses = async (appType: 'wa' | 'wab' = 'wa'): Promise<StatusMedia[]> => {
    try {
        const { files } = await Saf.listStatuses({ type: appType });
        return Promise.all(
            files.map(async (f) => {
                let displayUri = f.uri;
                let thumbnail: string | undefined;
                try {
                    // Copy to cache using our native method
                    const res = await Saf.copyToCache({ uri: f.uri, name: f.name });

                    if (window.Ionic) {
                        displayUri = window.Ionic.WebView.convertFileSrc("file://" + res.path);
                        if (res.thumbnail) {
                            thumbnail = window.Ionic.WebView.convertFileSrc("file://" + res.thumbnail);
                        }
                    }
                } catch (err) {
                    console.error('Failed to copy to cache', f.name, err);
                }

                return {
                    id: `${appType}_${f.name}`,
                    name: f.name,
                    uri: displayUri,
                    thumbnail,
                    originalUri: f.uri,
                    size: f.size,
                    lastModified: f.lastModified,
                    type: f.type,
                    isCached: true,
                    appType
                };
            })
        );
    } catch (err) {
        return [];
    }
};

export const shareStatus = async (status: StatusMedia) => {
    try {
        // We need the raw native path. We can strip the webview prefix or store it.
        // For now, let's just use the cached path logic.
        const res = await Saf.copyToCache({ uri: status.originalUri, name: status.name });
        await Saf.shareFile({ path: res.path, type: status.type });
    } catch (err) {
        console.error('Share failed', err);
    }
};

export const getCachedStatuses = async (): Promise<StatusMedia[]> => {
    try {
        const res = await Filesystem.readdir({
            path: CACHE_DIR,
            directory: Directory.Cache,
        });

        // Purge old files over 7 days
        const validStatuses: StatusMedia[] = [];
        const now = new Date();

        for (const file of res.files) {
            if (typeof file === 'string') continue; // Older capacitor API
            const stat = await Filesystem.stat({
                path: `${CACHE_DIR}/${file.name}`,
                directory: Directory.Cache,
            });

            const modifiedDate = new Date(stat.mtime);
            if (differenceInDays(now, modifiedDate) > 7) {
                // Delete old file
                await Filesystem.deleteFile({
                    path: `${CACHE_DIR}/${file.name}`,
                    directory: Directory.Cache,
                });
            } else {
                const type = file.name.endsWith('.mp4') ? 'video/mp4' :
                    file.name.endsWith('.gif') ? 'image/gif' : 'image/jpeg';

                // We get local uri using Filesystem.getUri to show it safely in app
                const { uri } = await Filesystem.getUri({
                    path: `${CACHE_DIR}/${file.name}`,
                    directory: Directory.Cache,
                });

                validStatuses.push({
                    id: file.name,
                    name: file.name,
                    uri: window.Ionic ? window.Ionic.WebView.convertFileSrc(uri) : uri,
                    originalUri: uri,
                    size: stat.size,
                    lastModified: stat.mtime,
                    type,
                    isCached: true,
                    appType: 'wa' // Default for cached
                });
            }
        }

        return validStatuses.sort((a, b) => b.lastModified - a.lastModified);
    } catch (e) {
        return [];
    }
};

export const saveStatusToGallery = async (status: StatusMedia): Promise<boolean> => {
    try {
        await Saf.saveToGallery({
            name: status.name,
            uri: status.originalUri, // Use originalUri (content:// or file://) for native code to process
        });
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
};
