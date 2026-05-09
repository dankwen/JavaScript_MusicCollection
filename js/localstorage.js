import { CDAlbum, DigitalAlbum } from './models/album.js';

export function saveCollection(data) {
    localStorage.setItem('musicCollection', JSON.stringify(data));
}

export function loadCollection() {
    const rawData = JSON.parse(localStorage.getItem('musicCollection')) || [];
    // Re-instantiate classes to maintain methods
    return rawData.map(item => {
        if (item.format === "CD") {
            return new CDAlbum(item.title, item.artist, item.runtime, item.coverUrl, item.isRipped);
        }
        return new DigitalAlbum(item.title, item.artist, item.runtime, item.coverUrl, item.source);
    });
}