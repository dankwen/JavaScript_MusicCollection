export class Album {
    constructor(title, artist, runtime, coverUrl) {
        this.id = Date.now() + Math.random();
        this.title = title;
        this.artist = artist;
        this.runtime = runtime;
        this.coverUrl = coverUrl || 'https://via.placeholder.com/50';
        this.createdAt = new Date();
    }

    summary() {
        return `${this.title} by ${this.artist}`;
    }
}

export class CDAlbum extends Album {
    constructor(title, artist, runtime, coverUrl, isRipped = false) {
        super(title, artist, runtime, coverUrl);
        this.format = "CD";
        this.isRipped = isRipped;
    }
}

export class DigitalAlbum extends Album {
    constructor(title, artist, runtime, coverUrl, source) {
        super(title, artist, runtime, coverUrl);
        this.format = "Digital";
        this.source = source;
    }
}