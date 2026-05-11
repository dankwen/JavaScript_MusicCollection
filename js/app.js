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
} catch (error) {
    collection = [];
}

// Checking to see if we have enough items for the assignment requirement of 12
if (collection.length < 12) {
    console.log("Collection is looking thin. Pushing seed data...");

    const seedData = [
        new CDAlbum("Entreat", "The Cure", 1991, "https://upload.wikimedia.org/wikipedia/en/c/cd/The_Cure_Entreat.jpg", true),
        new DigitalAlbum("Tragic Kingdom", "No Doubt", 1995, "https://upload.wikimedia.org/wikipedia/en/9/9d/No_Doubt_-_Tragic_Kingdom.png", "Amazon"),
        new CDAlbum("Just Say Mao", "Sire CD Sampler", 1989, "https://upload.wikimedia.org/wikipedia/en/7/74/Just_Say_Mao.jpg", false),
        new DigitalAlbum("Early Recordings", "Justin Hinds and the Dominoes", 1965, "https://m.media-amazon.com/images/I/61c5s6GdlEL._UX716_FMwebp_QL85_.jpg", "Amazon"),
        new CDAlbum("Welcome to the Pleasuredome", "Frankie Goes to Hollywood", 1984, "https://upload.wikimedia.org/wikipedia/en/0/0e/Welcome_To_The_Pleasuredome.jpg", true),
        new CDAlbum("Pop Goes The World", "Men Without Hats", 1987, "https://upload.wikimedia.org/wikipedia/en/a/a2/Men_Without_Hats-Pop_Goes_The_World.jpg", false),
        new CDAlbum("Delicate Sound of Thunder", "Pink Floyd", 1998, "https://upload.wikimedia.org/wikipedia/en/6/6b/Dsothunder-250.jpg", true),
        new DigitalAlbum("Disintegration", "The Cure", 1989, "https://upload.wikimedia.org/wikipedia/en/b/b8/CureDisintegration.jpg", "Amazon"),
        new DigitalAlbum("Find a Way Home", "MXPX", 2023, "https://upload.wikimedia.org/wikipedia/en/thumb/d/d6/Find_a_Way_Home.jpg/250px-Find_a_Way_Home.jpg", "Bandcamp"),
        new CDAlbum("Revolver", "The Beatles", 1966, "https://upload.wikimedia.org/wikipedia/en/thumb/e/ec/Revolver_%28album_cover%29.jpg/250px-Revolver_%28album_cover%29.jpg", false),
        new DigitalAlbum("LaTour", "LaTour", 1991, "https://upload.wikimedia.org/wikipedia/en/8/84/LaTouralbumcover.jpg", "Converted"),
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
function renderList(data = collection) {

    renderResultsEle.innerHTML = '';

    // Method .forEach replaces our for loop 
    data.forEach(function (album) {

        const extraInfo = album.format === "cd"
            // a ternary expression shortens the if... else statement
            // condition ? expressionIfTrue : expressionIfFalse;
            ? `<span class="badge ${album.isRipped ? 'bg-info' : 'bg-warning'}">
            <input type="checkbox" data-id="${album.id}" ${album.isRipped ? 'checked' : ''}> Converted</span>`
            : `<span class="badge bg-info">${album.source}</span>`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="d-none d-md-table-cell">
                <img src="${album.coverUrl}" class="rounded"></td>
            <td class="fw-bold">${album.title}</td>
            <td>${album.artist}</td>
            <td>${album.year}</td>
            <td class="text-center">${extraInfo}</td>
            <td class="text-center">
                <button class="btn btn-sm delete-btn" data-id="${album.id}">
                    <i class="bi bi-x-circle-fill"></i>
                </button><button class="btn btn-sm edit-btn" data-id="${album.id}">
                    <i class="bi bi-pencil-square"></i>
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
    const nameRegex = /^[A-Za-z0-9\s]{1,}$/;
    const titleVal = document.getElementById('title').value;
    const artistVal = document.getElementById('artist').value;

    if (!nameRegex.test(titleVal) || !nameRegex.test(artistVal)) {
        alert("Please enter a valid Title and Artist (at least 1 character).");
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
    renderList();
});

//#EndRegion ==================================================================================

//#Region Table Body Actions ===================================================================

document.getElementById('render-results').addEventListener('click', function (e) {
    const convertAlbum = e.target.closest('input[type="checkbox"]');
    const deleteAlbum = e.target.closest('.bi-x-circle-fill');

    // UX Note for Patrick:
    // I thought about putting the click event on the whole Ripped badge instead of just the checkbox,
    // But since the whole line is clickable to get album details, I wanted the conversion to be 
    // a little harder to trigger... so this is a deliberate choice, and since the feedback of status
    // is instant, a mis-click can be easily reversed.
    if (convertAlbum) {
        const id = Number(convertAlbum.dataset.id);
        const index = collection.findIndex(function (album) {
            if (album.id === id) { return true; }
            return false;
        });

        if (index > -1) {
            collection[index].isRipped = !collection[index].isRipped;
            saveCollection(collection);
            renderList();
        }
    }

    if (deleteAlbum) {
        const id = Number(deleteAlbum.parentElement.dataset.id);
        const index = collection.findIndex(function (album) {
            if (album.id === id) { return true; }
            return false;
        });

        if (index > -1) {
            if (confirm(`Are you sure you want to permanently delete the album: ${collection[index].title}? (WARNING: This can not be undone!)`)) {
                collection.splice(index, 1);
                saveCollection(collection);
                renderList();
            }
        }
    }
});

//#EndRegion ==================================================================================

//#Region Sorting and Filtering Listeners =====================================================
// Sorting and Filtering
document.getElementById('filter-search').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = collection.filter(a =>
        a.title.toLowerCase().includes(term) || a.artist.toLowerCase().includes(term)
    );
    renderList(filtered);
});

document.getElementById('filter-format').addEventListener('change', (e) => {
    const val = e.target.value;
    const filtered = val === 'all' ? collection : collection.filter(a => a.format === val);
    renderList(filtered);
});


//#EndRegion ==================================================================================

//#region Runtime let's get started! ==========================================================
console.group("---------- Runtime ----------");

renderList();

console.groupEnd();
//#endregion ==================================================================================
