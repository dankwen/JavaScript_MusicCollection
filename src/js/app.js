// Dan Wenger
// JavaScript Assignment M5 - Arrays


//#region Import Functions ====================================================================
import { albumId, setAlbumId } from './models/album.js';
import { CDAlbum } from './models/albumcd.js';
import { DigitalAlbum } from './models/albumdigital.js';
import { saveCollection, loadCollection } from './localstorage.js';
//#endregion ==================================================================================

//#region Define Global Variables =============================================================
const newAlbumFormEle = document.getElementById('album-form');
const albumFormatEle = document.getElementById('album-format');
const albumSourceHiderEle = document.getElementById('album-source-hider');
const renderResultsEle = document.getElementById('render-results');
const sortTitleIconEle = document.getElementById('sort-title-icon');
const sortArtistIconEle = document.getElementById('sort-artist-icon');
const sortYearIconEle = document.getElementById('sort-year-icon');

let collection = [];

let filterSearchSetting = '';
let filterFormatSetting = 'all';

let weSortedTitle = false;
let weSortedArtist = false;
let weSortedYear = false;

let currentAlbumId = null;
const albumModal = new bootstrap.Modal(document.getElementById('albumModal'));
const nameRegexForValidation = /^[\p{L}\p{N}][\p{L}\p{N}\s\-_$*&.,'()<>]*$/u;
const yearRegex = /^\d{4}$/;


//#endregion ==================================================================================

//#region Load/Populate Data Array ============================================================

// Load from localStorage with a try/catch in case there is no data or it's corrupted
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
        new CDAlbum("Show", "The Cure", 1993, "https://upload.wikimedia.org/wikipedia/en/3/36/Show_%28Cure_album%29.jpg", false),
        new DigitalAlbum("Disintegration", "The Cure", 1989, "https://upload.wikimedia.org/wikipedia/en/b/b8/CureDisintegration.jpg", "Amazon"),
        new DigitalAlbum("Find a Way Home", "MxPx", 2023, "https://upload.wikimedia.org/wikipedia/en/thumb/d/d6/Find_a_Way_Home.jpg/250px-Find_a_Way_Home.jpg", "Bandcamp"),
        new CDAlbum("Revolver", "The Beatles", 1966, "https://upload.wikimedia.org/wikipedia/en/thumb/e/ec/Revolver_%28album_cover%29.jpg/250px-Revolver_%28album_cover%29.jpg", false),
        new CDAlbum("Let It Happen", "MxPx", 1998, "https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/MxPx_-_Let_It_Happen_deluxe_edition_cover.jpg/250px-MxPx_-_Let_It_Happen_deluxe_edition_cover.jpg", false),
        new CDAlbum("Kiss Me, Kiss Me, Kiss Me", "The Cure", 1987, "https://upload.wikimedia.org/wikipedia/en/f/f5/The_Cure_-_Kiss_Me%2C_Kiss_Me%2C_Kiss_Me.jpg", true),
        new CDAlbum("Real, Real, Real", "Jesus Jones", 1990, "https://upload.wikimedia.org/wikipedia/en/8/82/Jesus_Jones_-_Real_Real_Real.jpg", false),
        new CDAlbum("Peace and Love, Inc.", "Information Society", 1992, "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Peace_and_Love_Inc.jpg/250px-Peace_and_Love_Inc.jpg", false),
        new CDAlbum("Wither Blister Burn & Peel", "Stabbing Westward", 1996, "https://upload.wikimedia.org/wikipedia/en/f/f3/StabbingWestwardWither.jpg", false),
        new DigitalAlbum("LaTour", "LaTour", 1991, "https://upload.wikimedia.org/wikipedia/en/8/84/LaTouralbumcover.jpg", "Amazon"),
        new DigitalAlbum("Borders & Boundaries", "Less Than Jake", 2000, "https://upload.wikimedia.org/wikipedia/en/e/e2/LTJ-Borders-boundaries.jpg", "Bandcamp")
    ];

    // Pushing into the array using a spread operator (replaces a loop to push them all in)
    collection.push(...seedData);

    saveCollection(collection);
}
//#endregion ==================================================================================

//#region Core Functions ======================================================================

//#region Render Function ---------------------------------------------------------------------
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
            <td class="d-none d-md-table-cell album-detail-trigger" data-id="${album.id}" role="button">
                <img src="${album.coverUrl}" class="rounded border"></td>
            <td class="fw-bold album-detail-trigger" data-id="${album.id}" role="button">${album.title}</td>
            <td class="album-detail-trigger" data-id="${album.id}" role="button">${album.artist}</td>
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
        }
    });
}
//#endregion ----------------------------------------------------------------------------------

//#region Update Sort Functions ---------------------------------------------------------------

function sortBy(topic) {
    collection.sort(function (a, b) {
        // Use bracket notation a[topic] to access the property dynamically
        const valA = String(a[topic]).toLowerCase();
        const valB = String(b[topic]).toLowerCase();

        if (valA < valB) { return -1; }
        if (valA > valB) { return 1; }
        return 0;
    });
    renderList();
}

function weSorted(target, direction) {

    sortTitleIconEle.innerHTML = '';
    sortArtistIconEle.innerHTML = '';
    sortYearIconEle.innerHTML = '';

    weSortedTitle = false;
    weSortedArtist = false;
    weSortedYear = false;

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
        default:
            break;
    }
}
//#endregion ----------------------------------------------------------------------------------

//#endregion ==================================================================================

//#region New Album Form ======================================================================

// Toggle Conditional Form Fields -------------------------------------------------------------
albumFormatEle.addEventListener('change', function (e) {
    if (albumFormatEle.value === 'cd') {
        albumSourceHiderEle.classList.add('d-none');
    } else {
        albumSourceHiderEle.classList.remove('d-none');
    }
});

// Add New Item with Validation ---------------------------------------------------------------

function setValidationError(inputEle, message) {
    const errorEle = document.getElementById(`${inputEle.id}-error`);
    if (errorEle) {
        errorEle.textContent = message;
        errorEle.classList.add('active');
    }
    inputEle.classList.add('input-error');
}

function clearValidationError(inputEle) {
    const errorEle = document.getElementById(`${inputEle.id}-error`);
    if (errorEle) {
        errorEle.textContent = '';
        errorEle.classList.remove('active');
    }
    inputEle.classList.remove('input-error');
}

function clearAllValidationErrors() {
    ['album-title', 'album-artist', 'album-year', 'album-cover', 'album-source'].forEach(function (id) {
        const element = document.getElementById(id);
        if (element) {
            clearValidationError(element);
        }
    });
}

function createAlbum() {
    clearAllValidationErrors();

    const titleInput = document.getElementById('album-title');
    const artistInput = document.getElementById('album-artist');
    const yearInput = document.getElementById('album-year');
    const coverInput = document.getElementById('album-cover');
    const sourceInput = document.getElementById('album-source');

    const titleVal = titleInput.value.trim();
    const artistVal = artistInput.value.trim();
    const yearVal = yearInput.value.trim();
    const coverURLVal = coverInput.value.trim();
    const sourceVal = sourceInput.value.trim();

    const currentYear = new Date().getFullYear();

    let hasError = false;

    if (!nameRegexForValidation.test(titleVal)) {
        setValidationError(titleInput, 'Title must start with a letter and contain at least one character.');
        hasError = true;
    }

    if (!nameRegexForValidation.test(artistVal)) {
        setValidationError(artistInput, 'Artist must start with a letter and contain at least one character.');
        hasError = true;
    }

    if (!yearRegex.test(yearVal)) {
        setValidationError(yearInput, 'Year must be a four-digit number.');
        hasError = true;
    } else {
        const yearNumber = Number(yearVal);
        if (yearNumber < 1900 || yearNumber > currentYear) {
            setValidationError(yearInput, `Year must be between 1900 and ${currentYear}.`);
            hasError = true;
        }
    }

    try {
        new URL(coverURLVal);
    } catch (error) {
        setValidationError(coverInput, 'Cover URL must be a valid URL starting with https:// or http://.');
        hasError = true;
    }

    if (albumFormatEle.value === 'digital' && sourceVal === '') {
        setValidationError(sourceInput, 'Please select a source for digital albums.');
        hasError = true;
    }

    if (hasError) {
        return;
    }

    const albumYear = Number(yearVal);
    let newAlbum;

    if (albumFormatEle.value === 'cd') {
        newAlbum = new CDAlbum(titleVal, artistVal, albumYear, coverURLVal, false);
    } else {
        newAlbum = new DigitalAlbum(titleVal, artistVal, albumYear, coverURLVal, sourceVal);
    }

    collection.push(newAlbum);
    saveCollection(collection);
    newAlbumFormEle.reset();
    renderList();
}

// Album Form Listeners -----------------------------------------------------------------------
newAlbumFormEle.addEventListener('submit', function (e) {
    e.preventDefault();
    createAlbum();
});

newAlbumFormEle.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        createAlbum();
    }

    if (e.key === 'Escape') {
        clearAllValidationErrors();
        this.reset();
    }
});

//#endregion ==================================================================================

//#region Modal Functions =====================================================================

function clearEditValidationErrors() {
    ['edit-title', 'edit-artist', 'edit-year', 'edit-cover', 'edit-source'].forEach(function (id) {
        const element = document.getElementById(id);
        if (element) {
            clearValidationError(element);
        }
    });
}

function showAlbumDetailView(albumId) {
    const album = collection.find(a => a.id === albumId);
    if (!album) return;

    currentAlbumId = albumId;
    const summary = album.summary();

    document.getElementById('albumModalLabel').textContent = 'Album Details';
    document.getElementById('modal-cover-img').src = album.coverUrl;
    document.getElementById('modal-title-view').textContent = album.title;
    document.getElementById('modal-artist-view').textContent = album.artist;
    document.getElementById('modal-year-view').textContent = album.year;
    document.getElementById('modal-format-view').textContent = album.format === 'cd' ? 'Compact Disc' : 'Digital (MP3)';

    if (album.format === 'digital') {
        document.getElementById('modal-source-view-container').classList.remove('d-none');
        document.getElementById('modal-source-view').textContent = album.source;
    } else {
        document.getElementById('modal-source-view-container').classList.add('d-none');
    }

    document.getElementById('album-view-mode').classList.remove('d-none');
    document.getElementById('album-edit-mode').classList.add('d-none');
    document.getElementById('modal-edit-btn').classList.remove('d-none');
    document.getElementById('edit-action-buttons').classList.add('d-none');

    albumModal.show();
}

function switchToEditMode() {
    const album = collection.find(a => a.id === currentAlbumId);
    if (!album) return;

    clearEditValidationErrors();

    document.getElementById('albumModalLabel').textContent = 'Edit Album';
    document.getElementById('edit-title').value = album.title;
    document.getElementById('edit-artist').value = album.artist;
    document.getElementById('edit-year').value = album.year;
    document.getElementById('edit-cover').value = album.coverUrl;

    if (album.format === 'digital') {
        document.getElementById('edit-source-container').classList.remove('d-none');
        document.getElementById('edit-source').value = album.source;
    } else {
        document.getElementById('edit-source-container').classList.add('d-none');
    }

    document.getElementById('album-view-mode').classList.add('d-none');
    document.getElementById('album-edit-mode').classList.remove('d-none');
    document.getElementById('modal-edit-btn').classList.add('d-none');
    document.getElementById('edit-action-buttons').classList.remove('d-none');
}

function saveAlbumChanges() {
    clearEditValidationErrors();

    const titleInput = document.getElementById('edit-title');
    const artistInput = document.getElementById('edit-artist');
    const yearInput = document.getElementById('edit-year');
    const coverInput = document.getElementById('edit-cover');
    const sourceInput = document.getElementById('edit-source');

    const titleVal = titleInput.value.trim();
    const artistVal = artistInput.value.trim();
    const yearVal = yearInput.value.trim();
    const coverURLVal = coverInput.value.trim();
    const sourceVal = sourceInput.value.trim();

    const currentYear = new Date().getFullYear();
    let hasError = false;

    if (!nameRegexForValidation.test(titleVal)) {
        setValidationError(titleInput, 'Title must start with a letter and contain at least one character.');
        hasError = true;
    }

    if (!nameRegexForValidation.test(artistVal)) {
        setValidationError(artistInput, 'Artist must start with a letter and contain at least one character.');
        hasError = true;
    }

    if (!yearRegex.test(yearVal)) {
        setValidationError(yearInput, 'Year must be a four-digit number.');
        hasError = true;
    } else {
        const yearNumber = Number(yearVal);
        if (yearNumber < 1900 || yearNumber > currentYear) {
            setValidationError(yearInput, `Year must be between 1900 and ${currentYear}.`);
            hasError = true;
        }
    }

    try {
        new URL(coverURLVal);
    } catch (error) {
        setValidationError(coverInput, 'Cover URL must be a valid URL starting with https:// or http://.');
        hasError = true;
    }

    const album = collection.find(a => a.id === currentAlbumId);
    if (album.format === 'digital' && sourceVal === '') {
        setValidationError(sourceInput, 'Please select a source for digital albums.');
        hasError = true;
    }

    if (hasError) return;

    album.title = titleVal;
    album.artist = artistVal;
    album.year = Number(yearVal);
    album.coverUrl = coverURLVal;
    if (album.format === 'digital') {
        album.source = sourceVal;
    }

    saveCollection(collection);
    albumModal.hide();
    renderList();
}

//#endregion ==================================================================================

//#region Table Body Listener =================================================================

document.getElementById('render-results').addEventListener('click', function (e) {
    const convertAlbum = e.target.closest('input[type="checkbox"]');
    const deleteAlbum = e.target.closest('.bi-x-circle-fill');
    const editAlbum = e.target.closest('.edit-btn');
    const detailTrigger = e.target.closest('.album-detail-trigger');

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

    if (editAlbum) {
        const id = Number(editAlbum.dataset.id);
        showAlbumDetailView(id);
        setTimeout(() => switchToEditMode(), 100);
    }

    if (detailTrigger) {
        const id = Number(detailTrigger.dataset.id);
        showAlbumDetailView(id);
    }
});

//#endregion ==================================================================================

//#region Sorting Listeners ===================================================================

document.getElementById('sort-title').addEventListener('click', function (e) {
    switch (weSortedTitle) {
        case false:
            sortBy('title');
            weSorted('title', 'down');
            break;

        default:
            collection.reverse();
            weSorted('title', 'up');
            weSortedTitle = false;
            renderList();
            break;
    };
});

document.getElementById('sort-artist').addEventListener('click', function (e) {
    switch (weSortedArtist) {
        case false:
            sortBy('artist');
            weSorted('artist', 'down');
            break;

        default:
            collection.reverse();
            weSorted('artist', 'up');
            weSortedArtist = false;
            renderList();
            break;
    };
});

document.getElementById('sort-year').addEventListener('click', function (e) {
    switch (weSortedYear) {
        case false:
            sortBy('year');
            weSorted('year', 'down');
            break;

        default:
            collection.reverse();
            weSorted('year', 'up');
            weSortedYear = false;
            renderList();
            break;
    };
});

//#endregion ==================================================================================

//#region Filtering Listeners =================================================================
document.getElementById('filter-search').addEventListener('input', function (e) {
    filterSearchSetting = e.target.value.toLowerCase();
    renderList();
});

document.getElementById('filter-format').addEventListener('change', function (e) {
    filterFormatSetting = e.target.value;
    renderList();
});

//#endregion ==================================================================================

//#region Modal Listeners =====================================================================

document.getElementById('modal-edit-btn').addEventListener('click', function () {
    switchToEditMode();
});

document.getElementById('modal-save-btn').addEventListener('click', function () {
    saveAlbumChanges();
});

document.getElementById('modal-cancel-btn').addEventListener('click', function () {
    albumModal.hide();
    renderList();
});

//#endregion ==================================================================================

//#region Runtime let's get started! ==========================================================
console.group("---------- Runtime ----------");

renderList();

console.groupEnd();
//#endregion ==================================================================================
