// Translations
const TRANSLATIONS = {
    "male": "Masculino",
    "female": "Femenino",
    "divers": "Otro",
    "range": "Rango",
    "close": "Melé",
    "top": "Top",
    "jungle": "Jungla",
    "mid": "Mid",
    "bottom": "Bot/ADC",
    "support": "Soporte",
    // Regions
    "runeterra": "Runeterra",
    "ionia": "Jonia",
    "shurima": "Shurima",
    "demacia": "Demacia",
    "noxus": "Noxus",
    "freljord": "Freljord",
    "piltover": "Piltover",
    "zaun": "Zaun",
    "ixtal": "Ixtal",
    "void": "Vacío",
    "bandle-city": "Ciudad de Bandle",
    "bilgewater": "Aguas Estancadas",
    "shadow-isles": "Islas de la Sombra",
    "mount-targon": "Monte Targon",
    // Resources
    "Mana": "Maná",
    "Energy": "Energía",
    "None": "Nada",
    "Blood Well": "Pozo de Sangre",
    "Courage": "Valor",
    "Shield": "Escudo",
    "Rage": "Furia",
    "Fury": "Furia",
    "Ferocity": "Ferocidad",
    "Heat": "Calor",
    "Grit": "Coraje",
    "Crimson Rush": "Impulso Carmesí",
    "Flow": "Flujo",
    "Health": "Vida",
    // Genres
    "Fighter": "Luchador",
    "Mage": "Mago",
    "Assassin": "Asesino",
    "Marksman": "Tirador",
    "Tank": "Tanque",
    "Support": "Soporte"
};

const DDRAGON_VER = "14.22.1";
const IMG_BASE_URL = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/img/champion/`;

let championsData = [];
let targetChampion = null;
let gameOver = false;

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    setupEventListeners();
    registerServiceWorker();
});

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('Service Worker registrado'))
            .catch((err) => console.error('Error al registrar SW:', err));
    }
}

async function fetchData() {
    try {
        const response = await fetch('champions.json');
        if (!response.ok) throw new Error("Failed to load data");
        championsData = await response.json();
        
        // Pick random champion
        targetChampion = championsData[Math.floor(Math.random() * championsData.length)];
        console.log("Target (Debug):", targetChampion.name); // Keep for verification
        
    } catch (error) {
        console.error("Error loading champions:", error);
        alert("Error cargando los datos de campeones. Asegúrate de ejecutar esto en un servidor (o usa python -m http.server).");
    }
}

function setupEventListeners() {
    const input = document.getElementById('champion-input');
    const suggestionsBox = document.getElementById('suggestions');

    input.addEventListener('input', (e) => {
        if (gameOver) return;
        const val = e.target.value.toLowerCase();
        suggestionsBox.innerHTML = '';
        
        if (val.length < 1) {
            suggestionsBox.classList.add('hidden');
            return;
        }

        const matches = championsData.filter(c => c.name.toLowerCase().startsWith(val));
        
        if (matches.length > 0) {
            suggestionsBox.classList.remove('hidden');
            matches.forEach(match => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                // Add image to suggestion
                const imgUrl = match.image ? `${IMG_BASE_URL}${match.image.full}` : '';
                div.innerHTML = `<img src="${imgUrl}" class="suggestion-img" alt=""> <span>${match.name}</span>`;
                div.onclick = () => selectChampion(match);
                suggestionsBox.appendChild(div);
            });
        } else {
            suggestionsBox.classList.add('hidden');
        }
    });

    // Hide suggestions on click outside
    document.addEventListener('click', (e) => {
        if (e.target !== input && e.target !== suggestionsBox) {
            suggestionsBox.classList.add('hidden');
        }
    });
}

function selectChampion(champion) {
    const input = document.getElementById('champion-input');
    const suggestionsBox = document.getElementById('suggestions');
    
    input.value = '';
    suggestionsBox.classList.add('hidden');
    
    processGuess(champion);
}

function translate(text) {
    if (!text) return "-";
    const parts = text.toString().split(',');
    const translated = parts.map(p => TRANSLATIONS[p.trim()] || p.trim());
    return translated.join(', ');
}

function compareAttribute(target, guess) {
    const tStr = String(target || "").toLowerCase();
    const gStr = String(guess || "").toLowerCase();
    
    if (tStr === gStr) return 'correct';
    
    const tSet = new Set(tStr.split(',').map(s => s.trim()));
    const gSet = new Set(gStr.split(',').map(s => s.trim()));
    
    // Check if sets are equal (ignoring order)
    if (tSet.size === gSet.size && [...tSet].every(x => gSet.has(x))) {
        return 'correct';
    }
    
    // Check intersection
    const intersection = [...tSet].filter(x => gSet.has(x));
    if (intersection.length > 0) return 'partial';
    
    return 'incorrect';
}

function processGuess(champion) {
    const container = document.getElementById('results-container');
    const row = document.createElement('div');
    row.className = 'guess-row';

    // 1. Champion Name & Image
    const isTarget = champion.id === targetChampion.id;
    const nameStatus = isTarget ? 'correct' : 'incorrect';
    
    const nameCol = createCol(champion.name, nameStatus);
    
    // Custom content for first col
    nameCol.innerHTML = `
        <img src="${IMG_BASE_URL}${champion.image.full}" class="champion-img">
        <span>${champion.name}</span>
    `;
    nameCol.classList.add('champion-col');
    
    // 2. Gender
    const genderStatus = compareAttribute(targetChampion.gender, champion.gender);
    const genderCol = createCol(translate(champion.gender), genderStatus);

    // 3. Position
    const laneStatus = compareAttribute(targetChampion.lane, champion.lane);
    const laneCol = createCol(translate(champion.lane), laneStatus);

    // 4. Species (Genre)
    const genreStatus = compareAttribute(targetChampion.genre, champion.genre);
    const genreCol = createCol(translate(champion.genre), genreStatus);

    // 5. Resource
    const resStatus = compareAttribute(targetChampion.resource, champion.resource);
    const resCol = createCol(translate(champion.resource), resStatus);

    // 6. Range Type
    const rangeStatus = compareAttribute(targetChampion.attackType, champion.attackType);
    const rangeCol = createCol(translate(champion.attackType), rangeStatus);

    // 7. Region
    const regionStatus = compareAttribute(targetChampion.region, champion.region);
    const regionCol = createCol(translate(champion.region), regionStatus);

    // 8. Year
    const tYear = parseInt(targetChampion.releaseDate || 0);
    const gYear = parseInt(champion.releaseDate || 0);
    let yearStatus = 'incorrect';
    let arrow = '';
    
    if (tYear === gYear) {
        yearStatus = 'correct';
    } else {
        arrow = tYear > gYear ? '↑' : '↓';
    }
    const yearCol = createCol(gYear + ' ' + arrow, yearStatus);


    // Append all
    row.appendChild(nameCol);
    row.appendChild(genderCol);
    row.appendChild(laneCol);
    row.appendChild(genreCol);
    row.appendChild(resCol);
    row.appendChild(rangeCol);
    row.appendChild(regionCol);
    row.appendChild(yearCol);

    // Insert at top
    container.insertBefore(row, container.firstChild);

    if (isTarget) {
        gameOver = true;
        showVictory(champion);
    }
}

function createCol(text, status) {
    const div = document.createElement('div');
    div.className = `col square ${status}`;
    div.innerText = text;
    return div;
}

function showVictory(champion) {
    const modal = document.getElementById('victory-modal');
    const title = document.getElementById('victory-title');
    const msg = document.getElementById('victory-message');
    const img = document.getElementById('victory-image');
    
    title.innerText = `¡${champion.name}!`;
    msg.innerText = champion.title || "Campeón Correcto";
    img.src = `${IMG_BASE_URL}${champion.image.full}`;
    
    modal.classList.remove('hidden');
}
