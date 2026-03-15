import { registerPlugin } from '@capacitor/core';

export interface SafPlugin {
    requestAccess(options?: { type?: 'wa' | 'wab' }): Promise<{ granted: boolean }>;
    listStatuses(options?: { type?: 'wa' | 'wab' }): Promise<{ files: any[] }>;
    copyToCache(options: { uri: string; name: string }): Promise<{ path: string; thumbnail?: string }>;
    saveToGallery(options: { uri: string; name: string }): Promise<{ success: boolean; path: string }>;
    shareFile(options: { path: string; type?: string }): Promise<void>;
}

const Saf = registerPlugin<SafPlugin>('Saf');

export default Saf;
