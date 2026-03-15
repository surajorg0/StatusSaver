import { registerPlugin } from '@capacitor/core';

export interface SafPlugin {
    requestAccess(): Promise<{ granted: boolean }>;
    listStatuses(): Promise<{ files: Array<{ name: string; uri: string; size: number; lastModified: number; type: string }> }>;
    copyToCache(options: { uri: string, name: string }): Promise<{ path: string }>;
    saveToGallery(options: { uri: string; name: string }): Promise<{ success: boolean; path: string }>;
}

const Saf = registerPlugin<SafPlugin>('Saf');

export default Saf;
