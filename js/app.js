// Dan Wenger
// JavaScript Assignment M5 - Arrays

//#region IPO Chart ===========================================================================
console.groupCollapsed("---------- IPO Chart ----------");
console.group("---------- INPUTS -----------");
console.log("");
console.groupEnd();
console.group("---------- PROCESS ----------");
console.log("");
console.groupEnd();
console.group("---------- OUTPUT -----------");
console.log("");
console.groupEnd();
console.groupEnd();
console.log("\n\n");
//#endregion ==================================================================================


//#Region Imports and Setups ==================================================================
import { albumId, setAlbumId } from './models/album.js';
import { CDAlbum } from './models/albumcd.js';
import { DigitalAlbum } from './models/albumdigital.js';
import { saveCollection, loadCollection } from './localstorage.js';

let collection = [];

// Load from localStorage but do so with a try/fail in case there is no data or it's corrupted
try {
    collection = loadCollection();
    console.log("Storage check: Found " + collection.length + " items.");
} catch (error) {
    console.log("Load failed or storage empty. Resetting collection.", error);
    collection = [];
}

// We need to reset the currentId serial since our old data has serials
if (collection.length > 0) {
    console.log("We found localstorage data so resetting albumId.");
    let maxId = 0;
    for (let i = 0; i < collection.length; i++) {
        let id = Number(collection[i].id);
        if (id > maxId) {
            maxId = id;
        }
    }
    console.log(`We found maxId of ${maxId} so resetting to that.`)
    setAlbumId(maxId);
}

// Checking to see if we have enough items for the assignment requirement of 12
if (collection.length < 12) {
    console.log("Collection is looking thin. Pushing seed data...");

    const seedData = [
        new CDAlbum("Entreat", "The Cure", 1991, "https://upload.wikimedia.org/wikipedia/en/c/cd/The_Cure_Entreat.jpg", true),
        new DigitalAlbum("Tragic Kingdom", "No Doubt", 1995, "https://upload.wikimedia.org/wikipedia/en/9/9d/No_Doubt_-_Tragic_Kingdom.png", "Amazon"),
        new CDAlbum("Just Say Mao", "Sire CD Sampler", 1989, "https://upload.wikimedia.org/wikipedia/en/7/74/Just_Say_Mao.jpg", false),
        new DigitalAlbum("Early Recordings", "Justin Hinds & The Dominoes", 1965, "https://m.media-amazon.com/images/I/61c5s6GdlEL._UX716_FMwebp_QL85_.jpg", "Amazon"),
        new CDAlbum("Welcome to the Pleasuredome", "Frankie Goes to Hollywood", 1984, "https://upload.wikimedia.org/wikipedia/en/0/0e/Welcome_To_The_Pleasuredome.jpg", true),
        new CDAlbum("Pop Goes The World", "Men Without Hats", 1987, "https://upload.wikimedia.org/wikipedia/en/a/a2/Men_Without_Hats-Pop_Goes_The_World.jpg", false),
        new DigitalAlbum("Disintegration", "The Cure", 1989, "https://upload.wikimedia.org/wikipedia/en/b/b8/CureDisintegration.jpg", "Converted"),
        new CDAlbum("Delicate Sound of Thunder", "Pink Floyd", 1998, "https://upload.wikimedia.org/wikipedia/en/6/6b/Dsothunder-250.jpg", true),
        new DigitalAlbum("Find a Way Home", "MXPX", 2023, "https://upload.wikimedia.org/wikipedia/en/thumb/d/d6/Find_a_Way_Home.jpg/250px-Find_a_Way_Home.jpg", "Bandcamp"),
        new CDAlbum("Revolver", "The Beatles", 1966, "https://upload.wikimedia.org/wikipedia/en/thumb/e/ec/Revolver_%28album_cover%29.jpg/250px-Revolver_%28album_cover%29.jpg", false),
        new DigitalAlbum("LaTour", "LaTour", 1991, "https://upload.wikimedia.org/wikipedia/en/8/84/LaTouralbumcover.jpg", "Other"),
        new DigitalAlbum("Borders & Boundaries", "Less Than Jake", 2000, "https://upload.wikimedia.org/wikipedia/en/e/e2/LTJ-Borders-boundaries.jpg", "Bandcamp")
    ];

    // Pushing into the array using a spread operator (replaces a loop to push them all in)
    collection.push(...seedData);

    saveCollection(collection);
}
//#EndRegion ==================================================================================


//#Region Define Element Variables ============================================================
const newAlbumFormEle = document.getElementById('album-form');
const albumFormatEle = document.getElementById('album-format');
const albumSourceEle = document.getElementById('album-source');
const albumSourceHiderEle = document.getElementById('album-source-hider');
const renderResultsEle = document.getElementById('render-results');


//#EndRegion ==================================================================================

//#Region Render Function =====================================================================

function render(data = collection) {
    renderResultsEle.innerHTML = '';
    data.forEach(album => {
        const tr = document.createElement('tr');
        const extraInfo = album.format === "cd"
            ? `<input type="checkbox" ${album.isRipped ? 'checked' : ''} onclick="return false;"> Ripped`
            : `<span class="badge bg-info">${album.source}</span>`;

        tr.innerHTML = `
            <td class="d-none d-sm-block"><img src="${album.coverUrl}" width="40" height="40" class="rounded"></td>
            <td class="fw-bold">${album.title}</td>
            <td>${album.artist}</td>
            <td><span class="badge ${album.format === 'cd' ? 'bg-secondary' : 'bg-primary'}">${album.format}</span></td>
            <td class="text-center">${extraInfo}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-danger" onclick="deleteAlbum(${album.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        renderResultsEle.appendChild(tr);
    });
}

//#EndRegion ==================================================================================

//#Region New/Edit Album Form =================================================================

// Toggle Conditional Form Fields -------------------------------------------------------------
albumFormatEle.addEventListener('change', function (e) {
    if (albumFormatEle.value === 'cd') {
        albumSourceHiderEle.classList.add('d-none');
    } else {
        albumSourceHiderEle.classList.remove('d-none');
    }
});


// Add New Item with Validation ---------------------------------------------------------------
newAlbumFormEle.addEventListener('submit', (e) => {
    e.preventDefault();

    // RegExp Validation (Requirement: Title/Artist must start with Letter, 2+ chars)
    const nameRegex = /^[A-Za-z0-9\s]{2,}$/;
    const titleVal = document.getElementById('title').value;
    const artistVal = document.getElementById('artist').value;

    if (!nameRegex.test(titleVal) || !nameRegex.test(artistVal)) {
        alert("Please enter a valid Title and Artist (at least 2 characters).");
        return;
    }

    let newAlbum;
    const runtime = document.getElementById('runtime').value;
    const cover = document.getElementById('cover').value;

    if (formatSelect.value === "cd") {
        newAlbum = new CDAlbum(titleVal, artistVal, runtime, cover, document.getElementById('isRipped').checked);
    } else {
        newAlbum = new DigitalAlbum(titleVal, artistVal, runtime, cover, document.getElementById('source').value);
    }

    collection.push(newAlbum);
    saveCollection(collection);
    form.reset();
    render();
});
//#EndRegion ==================================================================================

//#Region Sorting and Filtering Listeners =====================================================
// Sorting and Filtering
document.getElementById('filter-search').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = collection.filter(a =>
        a.title.toLowerCase().includes(term) || a.artist.toLowerCase().includes(term)
    );
    render(filtered);
});

document.getElementById('filter-format').addEventListener('change', (e) => {
    const val = e.target.value;
    const filtered = val === 'all' ? collection : collection.filter(a => a.format === val);
    render(filtered);
});

// Global delete function
window.deleteAlbum = (id) => {
    collection = collection.filter(a => a.id !== id);
    saveCollection(collection);
    render();
};

//#EndRegion ==================================================================================

//#region Runtime let's get started! ==========================================================
console.group("---------- Runtime ----------");

render();

console.groupEnd();
//#endregion ==================================================================================
