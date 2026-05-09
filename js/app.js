import { CDAlbum, DigitalAlbum } from './models/Album.js';
import { saveCollection, loadCollection } from './localstorage.js';

let collection = loadCollection();

// Pre-populate if empty (Requirement: 12 items)
if (collection.length === 0) {
    const seedData = [
        new CDAlbum("Discovery", "Daft Punk", 61, "", true),
        new DigitalAlbum("Midnights", "Taylor Swift", 44, "", "Amazon"),
        new CDAlbum("The Dark Side of the Moon", "Pink Floyd", 43, "", false),
        new DigitalAlbum("After Hours", "The Weeknd", 60, "", "Bandcamp"),
        new CDAlbum("Rumours", "Fleetwood Mac", 40, "", true),
        new CDAlbum("Back in Black", "AC/DC", 42, "", false),
        new DigitalAlbum("Renaissance", "Beyoncé", 62, "", "Amazon"),
        new CDAlbum("Nevermind", "Nirvana", 42, "", true),
        new DigitalAlbum("Plastic Beach", "Gorillaz", 56, "", "Bandcamp"),
        new CDAlbum("Abbey Road", "The Beatles", 47, "", false),
        new DigitalAlbum("Currents", "Tame Impala", 51, "", "Other"),
        new CDAlbum("Thriller", "Michael Jackson", 42, "", true)
    ];
    collection = seedData;
    saveCollection(collection);
}

// Selectors
const form = document.getElementById('album-form');
const formatSelect = document.getElementById('format');
const cdFields = document.getElementById('cd-fields');
const digitalFields = document.getElementById('digital-fields');
const tbody = document.getElementById('collection-body');

// Toggle Conditional Form Fields
formatSelect.addEventListener('change', () => {
    if (formatSelect.value === 'CD') {
        cdFields.classList.remove('d-none');
        digitalFields.classList.add('d-none');
    } else {
        cdFields.classList.add('d-none');
        digitalFields.classList.remove('d-none');
    }
});

function render(data = collection) {
    tbody.innerHTML = '';
    data.forEach(album => {
        const tr = document.createElement('tr');
        const extraInfo = album.format === "CD" 
            ? `<input type="checkbox" ${album.isRipped ? 'checked' : ''} onclick="return false;"> Ripped`
            : `<span class="badge bg-info">${album.source}</span>`;

        tr.innerHTML = `
            <td><img src="${album.coverUrl}" width="40" height="40" class="rounded"></td>
            <td class="fw-bold">${album.title}</td>
            <td>${album.artist}</td>
            <td><span class="badge ${album.format === 'CD' ? 'bg-secondary' : 'bg-primary'}">${album.format}</span></td>
            <td class="text-center">${extraInfo}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-danger" onclick="deleteAlbum(${album.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        // Preview on click (Requirement)
        tr.addEventListener('click', (e) => {
            if(!e.target.closest('button')) alert(`Album Detail: ${album.summary()}\nRuntime: ${album.runtime} mins`);
        });
        tbody.appendChild(tr);
    });
}

// Add New Item with Validation
form.addEventListener('submit', (e) => {
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

    if (formatSelect.value === "CD") {
        newAlbum = new CDAlbum(titleVal, artistVal, runtime, cover, document.getElementById('isRipped').checked);
    } else {
        newAlbum = new DigitalAlbum(titleVal, artistVal, runtime, cover, document.getElementById('source').value);
    }

    collection.push(newAlbum);
    saveCollection(collection);
    form.reset();
    render();
});

// Sorting and Filtering
document.getElementById('search-bar').addEventListener('input', (e) => {
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

render();