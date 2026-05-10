import { Album } from "./album.js";

export class DigitalAlbum extends Album {
    constructor(title, artist, year, coverUrl, source) {
        super(title, artist, coverUrl);
        this.format = "digital";
        this.source = source;
    }
}