import { CDAlbum } from './models/albumcd.js';
import { DigitalAlbum } from './models/albumdigital.js';

export function saveCollection(data) {
    localStorage.setItem('musicCollection', JSON.stringify(data));
}

export function loadCollection() {
    const rawData = JSON.parse(localStorage.getItem('musicCollection')) || [];
    // the .map method allows us to convert the data into something else
    // In this case, we create a new set of albums using the constructors...
    // (This also avoids any localstorage persistent .id errors that I had to deal with in my task manager)
    return rawData.map(function(item) {
        if (item.format === "cd") {
            return new CDAlbum(item.title, item.artist, item.year, item.coverUrl, item.isRipped);
        }
        return new DigitalAlbum(item.title, item.artist, item.year, item.coverUrl, item.source);
    });
}