import { CDAlbum } from './models/albumcd.js';
import { DigitalAlbum } from './models/albumdigital.js';

export function saveCollection(data) {
    localStorage.setItem('musicCollection', JSON.stringify(data));
}

export function loadCollection() {
    const rawData = JSON.parse(localStorage.getItem('musicCollection')) || [];
    // Re-instantiate classes to maintain methods
    return rawData.map(item => {
        if (item.format === "cd") {
            return new CDAlbum(item.title, item.artist, item.date, item.coverUrl, item.isRipped);
        }
        return new DigitalAlbum(item.title, item.artist, item.date, item.coverUrl, item.source);
    });
}