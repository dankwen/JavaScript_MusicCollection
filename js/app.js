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


//#Region Define Some Scoped Variables ========================================================
const newAlbumFormEle = document.getElementById('album-form');
const albumFormatEle = document.getElementById('album-format');
const albumSourceEle = document.getElementById('album-source');
const albumSourceHiderEle = document.getElementById('album-source-hider');
const renderResultsEle = document.getElementById('render-results');
const sortTitleIconEle = document.getElementById('sort-title-icon');
const sortArtistIconEle = document.getElementById('sort-artist-icon');
const sortYearIconEle = document.getElementById('sort-year-icon');
const sortStatusIconEle = document.getElementById('sort-status-icon');

let collection = [];

let filterSearchSetting = '';
let filterFormatSetting = 'all';

let weSortedTitle = false;
let weSortedArtist = false;
let weSortedYear = false;
let weSortedStatus = false;

//#EndRegion ==================================================================================


//#Region Imports and Setups ==================================================================
import { albumId, setAlbumId } from './models/album.js';
import { CDAlbum } from './models/albumcd.js';
import { DigitalAlbum } from './models/albumdigital.js';
import { saveCollection, loadCollection } from './localstorage.js';

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
        new CDAlbum("Delicate Sound of Thunder", "Pink Floyd", 1998, "https://upload.wikimedia.org/wikipedia/en/6/6b/Dsothunder-250.jpg", false),
        new DigitalAlbum("Disintegration", "The Cure", 1989, "https://upload.wikimedia.org/wikipedia/en/b/b8/CureDisintegration.jpg", "Amazon"),
        new DigitalAlbum("Find a Way Home", "MXPX", 2023, "https://upload.wikimedia.org/wikipedia/en/thumb/d/d6/Find_a_Way_Home.jpg/250px-Find_a_Way_Home.jpg", "Bandcamp"),
        new CDAlbum("Revolver", "The Beatles", 1966, "https://upload.wikimedia.org/wikipedia/en/thumb/e/ec/Revolver_%28album_cover%29.jpg/250px-Revolver_%28album_cover%29.jpg", false),
        new DigitalAlbum("LaTour", "LaTour", 1991, "https://upload.wikimedia.org/wikipedia/en/8/84/LaTouralbumcover.jpg", "Amazon"),
        new DigitalAlbum("Borders & Boundaries", "Less Than Jake", 2000, "https://upload.wikimedia.org/wikipedia/en/e/e2/LTJ-Borders-boundaries.jpg", "Bandcamp")
    ];

    // Pushing into the array using a spread operator (replaces a loop to push them all in)
    collection.push(...seedData);

    saveCollection(collection);
}
//#EndRegion ==================================================================================


//#Region Functions ===========================================================================

// Render Function ----------------------------------------------------------------------------
function renderList() {

    renderResultsEle.innerHTML = '';

    // Method .forEach replaces our for loop 
    collection.forEach(function (album) {

        if (
            (filterFormatSetting === 'all' || album.format === filterFormatSetting) &&
            (filterSearchSetting === '' ||
                album.title.toLowerCase().includes(filterSearchSetting) ||
                album.artist.toLowerCase().includes(filterSearchSetting))) {

            const extraInfo = album.format === "cd"
                // a ternary expression shortens the if... else statement
                // condition ? expressionIfTrue : expressionIfFalse;
                ? `<span class="badge ${album.isRipped ? 'bg-info' : 'bg-warning'}">
            <input type="checkbox" data-id="${album.id}" ${album.isRipped ? 'checked' : ''}> Converted</span>`
                : `<span class="badge bg-info">${album.source}</span>`;

            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td class="d-none d-md-table-cell">
                <img src="${album.coverUrl}" class="rounded border"></td>
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
            </td>`;
            renderResultsEle.appendChild(tr);
        };
    });
};

// Update Sort Icons --------------------------------------------------------------------------

function weSorted(target, direction) {

    sortTitleIconEle.innerHTML = '';
    sortArtistIconEle.innerHTML = '';
    sortYearIconEle.innerHTML = '';
    sortStatusIconEle.innerHTML = '';

    weSortedTitle = false;
    weSortedArtist = false;
    weSortedYear = false;
    weSortedStatus = false;

    switch (target) {
        case 'title':
            sortTitleIconEle.innerHTML = `<i class="bi bi-arrow-${direction}"></i>`;
            weSortedTitle = true;
            break;
        case 'artist':
            sortArtistIconEle.innerHTML = `<i class="bi bi-arrow-${direction}"></i>`;
            weSortedArtist = true;
            break;
        case 'year':
            sortYearIconEle.innerHTML = `<i class="bi bi-arrow-${direction}"></i>`;
            weSortedYear = true;
            break;
        case 'status':
            sortStatusIconEle.innerHTML = `<i class="bi bi-arrow-${direction}"></i>`;
            weSortedStatus = true;
            break;
        default:
            break;
    }

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
newAlbumFormEle.addEventListener('submit', function (e) {
    e.preventDefault();

    // RegExp Validation (Requirement: Title/Artist must start with Letter, 1+ chars)
    const titleVal = document.getElementById('album-title').value;
    const artistVal = document.getElementById('album-artist').value;
    const yearVal = document.getElementById('album-year').value;
    const coverURLVal = document.getElementById('album-cover').value;
    const nameRegex = /^[A-Za-z0-9\s]{1,}$/;

    if (!nameRegex.test(titleVal) || !nameRegex.test(artistVal)) {
        alert("Please enter a valid Title and Artist (at least 1 character).");
        return;
    }

    let newAlbum;

    if (formatSelect.value === "cd") {
        newAlbum = new CDAlbum(titleVal, artistVal, yearVal, coverURLVal, document.getElementById('isRipped').checked);
    } else {
        newAlbum = new DigitalAlbum(titleVal, artistVal, yearVal, coverURLVal, document.getElementById('source').value);
    }

    collection.push(newAlbum);
    saveCollection(collection);
    this.reset();
    renderList();
});

//#EndRegion ==================================================================================



//#Region Table Body Actions ===================================================================

document.getElementById('render-results').addEventListener('click', function (e) {
    const convertAlbum = e.target.closest('input[type="checkbox"]');
    const deleteAlbum = e.target.closest('.bi-x-circle-fill');

    // UX Note for Patrick:
    // I thought about putting the click event on the whole 'Converted' badge instead of just the checkbox,
    // But I wanted the conversion to be a little harder to trigger... the conversion is a one time event
    // that would only be done once, so this is a deliberate choice. 
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

// Sorting ------------------------------------------------------------------------------------
document.getElementById('sort-title').addEventListener('click', function (e) {
    switch (weSortedTitle) {
        case false:
            collection.sort(function (a, b) {
                if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
                else if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1; }
                else { return 0; }
            })
            weSorted('title', 'down');
            break;

        default: 
            collection.reverse();
            weSorted('title', 'up');
            weSortedTitle = false;
            break;
    };
    renderList();
});

document.getElementById('sort-artist').addEventListener('click', function (e) {
    switch (weSortedArtist) {
        case false:
            collection.sort(function (a, b) {
                if (a.artist.toLowerCase() < b.artist.toLowerCase()) { return -1; }
                else if (a.artist.toLowerCase() > b.artist.toLowerCase()) { return 1; }
                else { return 0; }
            })
            weSorted('artist', 'down');
            break;

        default: 
            collection.reverse();
            weSorted('artist', 'up');
            weSortedArtist = false;
            break;
    };
    renderList();
});

// Filters ------------------------------------------------------------------------------------
document.getElementById('filter-search').addEventListener('input', function (e) {
    filterSearchSetting = e.target.value.toLowerCase();
    renderList();
});

document.getElementById('filter-format').addEventListener('change', function (e) {
    filterFormatSetting = e.target.value;
    renderList();
});
//#EndRegion ==================================================================================



//#region Runtime let's get started! ==========================================================
console.group("---------- Runtime ----------");

renderList();

console.groupEnd();
//#endregion ==================================================================================
