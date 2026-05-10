import { Album } from "./album.js";

export class CDAlbum extends Album {
    constructor(title, artist, year, coverUrl, isRipped = false) {
        super(title, artist, year, coverUrl);
        this.format = "cd";
        this.isRipped = isRipped;
    }
}