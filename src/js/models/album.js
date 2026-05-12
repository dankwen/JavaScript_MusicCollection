
export let albumId = 0;

export function setAlbumId(id) {
    albumId = id;
}

export class Album {
    constructor(title, artist, year, coverUrl) {
        this.id = ++albumId;
        this.title = title;
        this.artist = artist;
        this.year = year;
        this.coverUrl = coverUrl;
    }

    summary() {
        return `${this.title} by ${this.artist}`;
    }
}



