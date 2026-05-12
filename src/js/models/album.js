
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
        return {
            id: this.id,
            title: this.title,
            artist: this.artist,
            year: this.year,
            coverUrl: this.coverUrl,
            format: this.format,
            displayText: `${this.title} by ${this.artist} (${this.year})`
        };
    }
}



