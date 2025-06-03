// Global variables
let currentChapter = 'bab1';
let currentQuiz = null;
let quizData = {};
let studyProgress = JSON.parse(localStorage.getItem('studyProgress')) || {};
let userNotes = JSON.parse(localStorage.getItem('userNotes')) || [];
let userBookmarks = JSON.parse(localStorage.getItem('userBookmarks')) || [];

// Periodic table data
const periodicTableData = {
    H: { name: 'Hidrogen', atomicNumber: 1, symbol: 'H', atomicMass: 1.008, type: 'nonmetal' },
    He: { name: 'Helium', atomicNumber: 2, symbol: 'He', atomicMass: 4.003, type: 'noble-gas' },
    Li: { name: 'Litium', atomicNumber: 3, symbol: 'Li', atomicMass: 6.941, type: 'metal' },
    Be: { name: 'Berilium', atomicNumber: 4, symbol: 'Be', atomicMass: 9.012, type: 'metal' },
    B: { name: 'Boron', atomicNumber: 5, symbol: 'B', atomicMass: 10.811, type: 'metalloid' },
    C: { name: 'Karbon', atomicNumber: 6, symbol: 'C', atomicMass: 12.011, type: 'nonmetal' },
    N: { name: 'Nitrogen', atomicNumber: 7, symbol: 'N', atomicMass: 14.007, type: 'nonmetal' },
    O: { name: 'Oksigen', atomicNumber: 8, symbol: 'O', atomicMass: 15.999, type: 'nonmetal' },
    F: { name: 'Fluorin', atomicNumber: 9, symbol: 'F', atomicMass: 18.998, type: 'nonmetal' },
    Ne: { name: 'Neon', atomicNumber: 10, symbol: 'Ne', atomicMass: 20.180, type: 'noble-gas' },
    Na: { name: 'Natrium', atomicNumber: 11, symbol: 'Na', atomicMass: 22.990, type: 'metal' },
    Mg: { name: 'Magnesium', atomicNumber: 12, symbol: 'Mg', atomicMass: 24.305, type: 'metal' },
    Al: { name: 'Aluminium', atomicNumber: 13, symbol: 'Al', atomicMass: 26.982, type: 'metal' },
    Si: { name: 'Silikon', atomicNumber: 14, symbol: 'Si', atomicMass: 28.086, type: 'metalloid' },
    P: { name: 'Fosfor', atomicNumber: 15, symbol: 'P', atomicMass: 30.974, type: 'nonmetal' },
    S: { name: 'Belerang', atomicNumber: 16, symbol: 'S', atomicMass: 32.065, type: 'nonmetal' },
    Cl: { name: 'Klorin', atomicNumber: 17, symbol: 'Cl', atomicMass: 35.453, type: 'nonmetal' },
    Ar: { name: 'Argon', atomicNumber: 18, symbol: 'Ar', atomicMass: 39.948, type: 'noble-gas' },
    K: { name: 'Kalium', atomicNumber: 19, symbol: 'K', atomicMass: 39.098, type: 'metal' },
    Ca: { name: 'Kalsium', atomicNumber: 20, symbol: 'Ca', atomicMass: 40.078, type: 'metal' }
};

// Electronegativity values
const electronegativity = {
    H: 2.20, Li: 0.98, Be: 1.57, B: 2.04, C: 2.55, N: 3.04, 
    O: 3.44, F: 3.98, Na: 0.93, Mg: 1.31, Al: 1.61, Si: 1.90, 
    P: 2.19, S: 2.58, Cl: 3.16, K: 0.82, Ca: 1.00
};

// Quiz questions data
const quizQuestions = {
    bab1: [
        {
            question: "Model atom yang memperkenalkan konsep kulit elektron dengan tingkat energi tertentu adalah model atom...",
            options: ["Dalton", "Thomson", "Rutherford", "Bohr"],
            correct: 3
        },
        {
            question: "Unsur X memiliki nomor atom 17. Konfigurasi elektron unsur X adalah...",
            options: ["2.8.7", "2.8.8", "2.7.8", "2.8.6"],
            correct: 0
        },
        {
            question: "Dalam satu periode dari kiri ke kanan, sifat yang bertambah adalah...",
            options: ["Jari-jari atom", "Energi ionisasi", "Sifat logam", "Jumlah kulit"],
            correct: 1
        }
    ],
    bab2: [
        {
            question: "Ikatan yang terjadi antara atom Na dan Cl adalah...",
            options: ["Ikatan kovalen", "Ikatan ion", "Ikatan hidrogen", "Ikatan logam"],
            correct: 1
        },
        {
            question: "Dalam molekul NH₃, atom N memiliki... pasangan elektron bebas",
            options: ["0", "1", "2", "3"],
            correct: 1
        }
    ],
    bab3: [
        {
            question: "Bentuk molekul CH₄ adalah...",
            options: ["Linear", "Segitiga planar", "Tetrahedral", "Piramida trigonal"],
            correct: 2
        }
    ]
};

// Molecular data for VSEPR
const molecularData = {
    BeF2: { geometry: 'Linear', angle: 180, pei: 2, peb: 0 },
    BF3: { geometry: 'Trigonal Planar', angle: 120, pei: 3, peb: 0 },
    CH4: { geometry: 'Tetrahedral', angle: 109.5, pei: 4, peb: 0 },
    NH3: { geometry: 'Trigonal Pyramid', angle: 107, pei: 3, peb: 1 },
    H2O: { geometry: 'Bent', angle: 104.5, pei: 2, peb: 2 },
    PCl5: { geometry: 'Trigonal Bipyramidal', angle: '90/120', pei: 5, peb: 0 },
    SF6: { geometry: 'Octahedral', angle: 90, pei: 6, peb: 0 }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    generatePeriodicTable();
    loadProgress();
    setupEventListeners();
});

// Initialize application
function initializeApp() {
    // Set initial atom model
    updateAtomModel();
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Initialize progress tracking
    if (!studyProgress.totalTime) {
        studyProgress.totalTime = 0;
        studyProgress.completedQuizzes = 0;
        studyProgress.averageScore = 0;
        studyProgress.chapterProgress = {
            bab1: 0, bab2: 0, bab3: 0, bab4: 0, bab5: 0, bab6: 0
        };
    }
    
    updateProgressDisplay();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.addEventListener('click', handleNavigation);
    
    // Scroll progress
    window.addEventListener('scroll', updateScrollProgress);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Auto-save notes
    const noteText = document.getElementById('noteText');
    if (noteText) {
        noteText.addEventListener('input', debounce(autoSaveNote, 1000));
    }
}

// Handle navigation clicks
function handleNavigation(e) {
    // Chapter navigation
    if (e.target.closest('.chapter-item')) {
        const chapter = e.target.closest('.chapter-item').dataset.chapter;
        navigateToChapter(chapter);
    }
    
    // Smooth scroll for nav links
    if (e.target.classList.contains('nav-link') && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Navigate to specific chapter
function navigateToChapter(chapterName) {
    currentChapter = chapterName;
    
    // Update active state in sidebar
    document.querySelectorAll('.chapter-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-chapter="${chapterName}"]`).classList.add('active');
    
    // Scroll to chapter
    const chapterElement = document.getElementById(chapterName);
    if (chapterElement) {
        chapterElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Mark as visited
    markChapterAsVisited(chapterName);
}

// Update scroll progress
function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';
}

// Smooth scroll to content
function scrollToContent() {
    document.getElementById('bab1').scrollIntoView({ behavior: 'smooth' });
}

// Generate periodic table
function generatePeriodicTable() {
    const periodicTableContainer = document.getElementById('periodicTable');
    if (!periodicTableContainer) return;
    
    // Create grid layout for periodic table
    const elements = Object.keys(periodicTableData);
    
    elements.forEach(symbol => {
        const element = periodicTableData[symbol];
        const elementDiv = document.createElement('div');
        elementDiv.className = `element ${element.type}`;
        elementDiv.innerHTML = `
            <div class="element-number">${element.atomicNumber}</div>
            <div class="element-symbol">${element.symbol}</div>
        `;
        elementDiv.addEventListener('click', () => showElementDetails(element));
        periodicTableContainer.appendChild(elementDiv);
    });
}

// Show element details
function showElementDetails(element) {
    const detailsContainer = document.getElementById('elementDetails');
    if (!detailsContainer) return;
    
    detailsContainer.innerHTML = `
        <h4>${element.name} (${element.symbol})</h4>
        <div class="element-info">
            <div class="info-item">
                <span>Nomor Atom:</span>
                <span>${element.atomicNumber}</span>
            </div>
            <div class="info-item">
                <span>Massa Atom:</span>
                <span>${element.atomicMass}</span>
            </div>
            <div class="info-item">
                <span>Jenis:</span>
                <span>${getElementTypeInIndonesian(element.type)}</span>
            </div>
            <div class="info-item">
                <span>Konfigurasi Elektron:</span>
                <span>${getElectronConfiguration(element.atomicNumber)}</span>
            </div>
            <div class="info-item">
                <span>Elektron Valensi:</span>
                <span>${getValenceElectrons(element.atomicNumber)}</span>
            </div>
        </div>
    `;
}

// Get element type in Indonesian
function getElementTypeInIndonesian(type) {
    const types = {
        'metal': 'Logam',
        'nonmetal': 'Non-logam',
        'metalloid': 'Metaloid',
        'noble-gas': 'Gas Mulia'
    };
    return types[type] || type;
}

// Get electron configuration
function getElectronConfiguration(atomicNumber) {
    const maxElectrons = [2, 8, 8, 18]; // K, L, M, N shells
    let remaining = atomicNumber;
    let config = [];
    
    for (let i = 0; i < maxElectrons.length && remaining > 0; i++) {
        const electrons = Math.min(remaining, maxElectrons[i]);
        if (i === 2 && remaining > 8) {
            config.push(8); // M shell max 8 for valence
            remaining -= 8;
        } else {
            config.push(electrons);
            remaining -= electrons;
        }
    }
    
    return config.join('.');
}

// Get valence electrons
function getValenceElectrons(atomicNumber) {
    const config = getElectronConfiguration(atomicNumber).split('.');
    return parseInt(config[config.length - 1]);
}

// Update atom model visualization
function updateAtomModel() {
    const elementSelect = document.getElementById('element-select');
    const atomViz = document.getElementById('atomViz');
    const atomInfo = document.getElementById('atomInfo');
    
    if (!elementSelect || !atomViz || !atomInfo) return;
    
    const selectedElement = elementSelect.value;
    const element = periodicTableData[selectedElement];
    
    if (!element) return;
    
    // Create atom visualization
    atomViz.innerHTML = '';
    const atomContainer = document.createElement('div');
    atomContainer.className = 'atom-container';
    atomContainer.style.cssText = `
        position: relative;
        width: 300px;
        height: 300px;
        margin: 0 auto;
    `;
    
    // Create nucleus
    const nucleus = document.createElement('div');
    nucleus.className = 'nucleus';
    nucleus.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 30px;
        height: 30px;
        background: radial-gradient(circle, #ff6b6b, #d63031);
        border-radius: 50%;
        z-index: 10;
        box-shadow: 0 0 15px rgba(255, 107, 107, 0.5);
    `;
    atomContainer.appendChild(nucleus);
    
    // Create electron shells
    const config = getElectronConfiguration(element.atomicNumber).split('.').map(n => parseInt(n));
    const shellRadii = [60, 100, 140, 180];
    
    config.forEach((electronCount, shellIndex) => {
        if (electronCount === 0) return;
        
        // Create shell circle
        const shell = document.createElement('div');
        shell.className = `shell shell-${shellIndex}`;
        const radius = shellRadii[shellIndex];
        shell.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${radius * 2}px;
            height: ${radius * 2}px;
            border: 2px solid rgba(74, 144, 226, 0.3);
            border-radius: 50%;
            animation: rotate 10s linear infinite;
        `;
        atomContainer.appendChild(shell);
        
        // Create electrons
        for (let i = 0; i < electronCount; i++) {
            const electron = document.createElement('div');
            electron.className = 'electron';
            const angle = (i * 360 / electronCount) * Math.PI / 180;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            electron.style.cssText = `
                position: absolute;
                top: calc(50% + ${y}px);
                left: calc(50% + ${x}px);
                transform: translate(-50%, -50%);
                width: 8px;
                height: 8px;
                background: radial-gradient(circle, #74b9ff, #0984e3);
                border-radius: 50%;
                animation: orbit${shellIndex} ${(shellIndex + 1) * 3}s linear infinite;
                box-shadow: 0 0 8px rgba(116, 185, 255, 0.6);
            `;
            atomContainer.appendChild(electron);
        }
    });
    
    atomViz.appendChild(atomContainer);
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rotate {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes orbit0 {
            from { transform: translate(-50%, -50%) rotate(0deg) translateX(${shellRadii[0]}px) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg) translateX(${shellRadii[0]}px) rotate(-360deg); }
        }
        @keyframes orbit1 {
            from { transform: translate(-50%, -50%) rotate(0deg) translateX(${shellRadii[1]}px) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg) translateX(${shellRadii[1]}px) rotate(-360deg); }
        }
        @keyframes orbit2 {
            from { transform: translate(-50%, -50%) rotate(0deg) translateX(${shellRadii[2]}px) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg) translateX(${shellRadii[2]}px) rotate(-360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Update atom info
    atomInfo.innerHTML = `
        <h4>${element.name} (${element.symbol})</h4>
        <div class="info-item">
            <span>Nomor Atom:</span>
            <span>${element.atomicNumber}</span>
        </div>
        <div class="info-item">
            <span>Proton:</span>
            <span>${element.atomicNumber}</span>
        </div>
        <div class="info-item">
            <span>Elektron:</span>
            <span>${element.atomicNumber}</span>
        </div>
        <div class="info-item">
            <span>Neutron:</span>
            <span>${Math.round(element.atomicMass) - element.atomicNumber}</span>
        </div>
        <div class="info-item">
            <span>Konfigurasi Elektron:</span>
            <span>${getElectronConfiguration(element.atomicNumber)}</span>
        </div>
        <div class="info-item">
            <span>Elektron Valensi:</span>
            <span>${getValenceElectrons(element.atomicNumber)}</span>
        </div>
    `;
}

// Generate Lewis structure
function generateLewisStructure() {
    const formulaInput = document.getElementById('molecular-formula');
    const lewisDisplay = document.getElementById('lewisDisplay');
    const lewisExplanation = document.getElementById('lewisExplanation');
    
    if (!formulaInput || !lewisDisplay || !lewisExplanation) return;
    
    const formula = formulaInput.value.trim().toUpperCase();
    
    // Simple Lewis structures for common molecules
    const lewisStructures = {
        'H2O': {
            structure: 'H-O-H dengan 2 pasang elektron bebas pada O',
            explanation: `
                <h4>Langkah-langkah menggambar struktur Lewis H₂O:</h4>
                <ol>
                    <li>Hitung total elektron valensi: H(1×2) + O(6) = 8 elektron</li>
                    <li>Tentukan atom pusat: O (kurang elektronegatif)</li>
                    <li>Hubungkan atom terminal H ke O: 4 elektron terpakai</li>
                    <li>Sisa 4 elektron ditempatkan sebagai 2 PEB pada O</li>
                    <li>Semua atom mencapai oktet/duplet</li>
                </ol>
            `
        },
        'NH3': {
            structure: 'H-N-H dengan H di atas dan 1 pasang elektron bebas',
            explanation: `
                <h4>Langkah-langkah menggambar struktur Lewis NH₃:</h4>
                <ol>
                    <li>Hitung total elektron valensi: N(5) + H(1×3) = 8 elektron</li>
                    <li>Tentukan atom pusat: N</li>
                    <li>Hubungkan 3 atom H ke N: 6 elektron terpakai</li>
                    <li>Sisa 2 elektron ditempatkan sebagai 1 PEB pada N</li>
                    <li>Semua atom mencapai oktet/duplet</li>
                </ol>
            `
        },
        'CO2': {
            structure: 'O=C=O (ikatan rangkap dua)',
            explanation: `
                <h4>Langkah-langkah menggambar struktur Lewis CO₂:</h4>
                <ol>
                    <li>Hitung total elektron valensi: C(4) + O(6×2) = 16 elektron</li>
                    <li>Tentukan atom pusat: C</li>
                    <li>Hubungkan 2 atom O ke C: 4 elektron terpakai</li>
                    <li>Lengkapi oktet O: 12 elektron lagi terpakai</li>
                    <li>C belum oktet, bentuk ikatan rangkap dua</li>
                </ol>
            `
        }
    };
    
    if (lewisStructures[formula]) {
        const data = lewisStructures[formula];
        lewisDisplay.innerHTML = `
            <div class="lewis-molecule">
                <h3>${formula}</h3>
                <p>${data.structure}</p>
            </div>
        `;
        lewisExplanation.innerHTML = data.explanation;
    } else {
        lewisDisplay.innerHTML = `
            <div class="lewis-error">
                <p>Struktur Lewis untuk ${formula} belum tersedia.</p>
                <p>Coba: H2O, NH3, CO2</p>
            </div>
        `;
        lewisExplanation.innerHTML = '';
    }
}

// Analyze bond between two elements
function analyzeBond() {
    const element1 = document.getElementById('element1').value;
    const element2 = document.getElementById('element2').value;
    const bondResult = document.getElementById('bondResult');
    
    if (!bondResult) return;
    
    const en1 = electronegativity[element1] || 0;
    const en2 = electronegativity[element2] || 0;
    const enDiff = Math.abs(en1 - en2);
    
    let bondType, explanation;
    
    if (enDiff === 0) {
        bondType = 'Ikatan Kovalen Nonpolar';
        explanation = 'Tidak ada perbedaan keelektronegatifan, elektron dibagi sama rata.';
    } else if (enDiff < 0.5) {
        bondType = 'Ikatan Kovalen Nonpolar';
        explanation = 'Perbedaan keelektronegatifan sangat kecil, ikatan hampir nonpolar.';
    } else if (enDiff < 1.7) {
        bondType = 'Ikatan Kovalen Polar';
        explanation = `${element2} lebih elektronegatif, elektron ikatan lebih tertarik ke ${element2}.`;
    } else {
        bondType = 'Ikatan Ion';
        explanation = `Perbedaan keelektronegatifan besar, terjadi transfer elektron dari ${element1} ke ${element2}.`;
    }
    
    bondResult.innerHTML = `
        <h4>Analisis Ikatan ${element1}-${element2}</h4>
        <div class="bond-analysis">
            <div class="electronegativity-values">
                <p><strong>Keelektronegatifan:</strong></p>
                <p>${element1}: ${en1}</p>
                <p>${element2}: ${en2}</p>
                <p><strong>Selisih:</strong> ${enDiff.toFixed(2)}</p>
            </div>
            <div class="bond-type">
                <h5>${bondType}</h5>
                <p>${explanation}</p>
            </div>
            <div class="bond-visualization">
                ${getBondVisualization(element1, element2, bondType)}
            </div>
        </div>
    `;
}

// Get bond visualization
function getBondVisualization(el1, el2, bondType) {
    if (bondType.includes('Ion')) {
        return `
            <div class="ionic-bond">
                <span class="cation">${el1}⁺</span>
                <span class="bond-arrow">→</span>
                <span class="anion">${el2}⁻</span>
            </div>
        `;
    } else if (bondType.includes('Polar')) {
        return `
            <div class="polar-bond">
                <span class="partial-positive">δ⁺${el1}</span>
                <span class="bond-line">—</span>
                <span class="partial-negative">${el2}δ⁻</span>
            </div>
        `;
    } else {
        return `
            <div class="nonpolar-bond">
                <span>${el1}</span>
                <span class="bond-line">—</span>
                <span>${el2}</span>
            </div>
        `;
    }
}

// Update VSEPR molecular geometry
function updateVSEPR() {
    const moleculeSelect = document.getElementById('vsepr-molecule');
    const molecule3D = document.getElementById('molecule3D');
    const vseprInfo = document.getElementById('vseprInfo');
    
    if (!moleculeSelect || !molecule3D || !vseprInfo) return;
    
    const molecule = moleculeSelect.value;
    const data = molecularData[molecule];
    
    if (!data) return;
    
    // Create 3D visualization
    molecule3D.innerHTML = `
        <div class="molecule-3d-container">
            <div class="molecule-name">${molecule}</div>
            <div class="geometry-visualization">
                ${getGeometryVisualization(molecule, data)}
            </div>
        </div>
    `;
    
    // Update molecular information
    vseprInfo.innerHTML = `
        <h4>${molecule}</h4>
        <div class="molecular-info">
            <div class="info-item">
                <span>Notasi VSEPR:</span>
                <span>AX${data.pei}${data.peb > 0 ? 'E' + data.peb : ''}</span>
            </div>
            <div class="info-item">
                <span>Geometri Molekul:</span>
                <span>${data.geometry}</span>
            </div>
            <div class="info-item">
                <span>Sudut Ikatan:</span>
                <span>${data.angle}°</span>
            </div>
            <div class="info-item">
                <span>PEI:</span>
                <span>${data.pei}</span>
            </div>
            <div class="info-item">
                <span>PEB:</span>
                <span>${data.peb}</span>
            </div>
        </div>
    `;
}

// Get geometry visualization
function getGeometryVisualization(molecule, data) {
    const visualizations = {
        'BeF2': '<div class="linear-geometry">F—Be—F</div>',
        'BF3': '<div class="trigonal-planar">Segitiga dengan B di tengah</div>',
        'CH4': '<div class="tetrahedral">Tetrahedron dengan C di tengah</div>',
        'NH3': '<div class="trigonal-pyramid">Piramida dengan N di puncak</div>',
        'H2O': '<div class="bent-geometry">Bentuk V dengan O di sudut</div>',
        'PCl5': '<div class="trigonal-bipyramidal">Bipiramida trigonal</div>',
        'SF6': '<div class="octahedral">Oktahedron dengan S di tengah</div>'
    };
    
    return visualizations[molecule] || '<div class="geometry-placeholder">Visualisasi 3D</div>';
}

// Update polarity display
function updatePolarity() {
    const moleculeSelect = document.getElementById('polarity-molecule');
    const polarityDisplay = document.getElementById('polarityDisplay');
    
    if (!moleculeSelect || !polarityDisplay) return;
    
    const molecule = moleculeSelect.value;
    
    const polarityData = {
        'H2': { polar: false, explanation: 'Molekul diatomik dengan atom sejenis' },
        'HCl': { polar: true, explanation: 'Ikatan H-Cl polar, molekul diatomik' },
        'H2O': { polar: true, explanation: 'Ikatan O-H polar, bentuk bengkok' },
        'CO2': { polar: false, explanation: 'Ikatan C=O polar, tetapi bentuk linear simetris' },
        'NH3': { polar: true, explanation: 'Ikatan N-H polar, bentuk piramida trigonal' },
        'CCl4': { polar: false, explanation: 'Ikatan C-Cl polar, tetapi bentuk tetrahedral simetris' }
    };
    
    const data = polarityData[molecule];
    if (!data) return;
    
    polarityDisplay.innerHTML = `
        <div class="polarity-result">
            <h4>${molecule}</h4>
            <div class="polarity-status ${data.polar ? 'polar' : 'nonpolar'}">
                ${data.polar ? 'POLAR' : 'NONPOLAR'}
            </div>
            <p>${data.explanation}</p>
            <div class="dipole-arrow">
                ${data.polar ? '→ Memiliki momen dipol' : '✕ Tidak memiliki momen dipol'}
            </div>
        </div>
    `;
}

// Test conductivity
function testConductivity() {
    const solutionSelect = document.getElementById('solution-type');
    const testCircuit = document.getElementById('testCircuit');
    const testResult = document.getElementById('testResult');
    
    if (!solutionSelect || !testCircuit || !testResult) return;
    
    const solution = solutionSelect.value;
    
    const conductivityData = {
        'NaCl': { type: 'Elektrolit Kuat', bulb: 'terang', bubbles: 'banyak', explanation: 'NaCl terionisasi sempurna menjadi Na⁺ dan Cl⁻' },
        'HCl': { type: 'Elektrolit Kuat', bulb: 'terang', bubbles: 'banyak', explanation: 'HCl terionisasi sempurna menjadi H⁺ dan Cl⁻' },
        'CH3COOH': { type: 'Elektrolit Lemah', bulb: 'redup', bubbles: 'sedikit', explanation: 'CH₃COOH hanya terionisasi sebagian' },
        'C6H12O6': { type: 'Non-elektrolit', bulb: 'tidak menyala', bubbles: 'tidak ada', explanation: 'Glukosa tidak terionisasi, tetap sebagai molekul' },
        'NH3': { type: 'Elektrolit Lemah', bulb: 'redup', bubbles: 'sedikit', explanation: 'NH₃ bereaksi dengan air membentuk sedikit ion' },
        'C2H5OH': { type: 'Non-elektrolit', bulb: 'tidak menyala', bubbles: 'tidak ada', explanation: 'Etanol tidak terionisasi dalam air' }
    };
    
    const data = conductivityData[solution];
    if (!data) return;
    
    // Animate circuit
    testCircuit.innerHTML = `
        <div class="test-setup">
            <div class="battery">🔋</div>
            <div class="wire wire1"></div>
            <div class="bulb ${data.bulb === 'terang' ? 'bright' : data.bulb === 'redup' ? 'dim' : 'off'}">💡</div>
            <div class="wire wire2"></div>
            <div class="electrode electrode1">|</div>
            <div class="solution-container">
                <div class="solution">${solution}</div>
                ${data.bubbles !== 'tidak ada' ? '<div class="bubbles">⚪⚪⚪</div>' : ''}
            </div>
            <div class="electrode electrode2">|</div>
            <div class="wire wire3"></div>
        </div>
    `;
    
    testResult.innerHTML = `
        <h4>Hasil Uji: ${solution}</h4>
        <div class="test-observations">
            <div class="observation">
                <span>Lampu:</span>
                <span class="${data.bulb}">${data.bulb}</span>
            </div>
            <div class="observation">
                <span>Gelembung:</span>
                <span>${data.bubbles}</span>
            </div>
            <div class="classification">
                <h5>${data.type}</h5>
                <p>${data.explanation}</p>
            </div>
        </div>
    `;
}

// Calculate oxidation numbers
function calculateOxidationNumbers() {
    const compoundInput = document.getElementById('compound-formula');
    const oxidationResult = document.getElementById('oxidationResult');
    
    if (!compoundInput || !oxidationResult) return;
    
    const compound = compoundInput.value.trim();
    
    // Simple oxidation number calculations for common compounds
    const oxidationNumbers = {
        'KMnO4': { K: '+1', Mn: '+7', O: '-2' },
        'H2SO4': { H: '+1', S: '+6', O: '-2' },
        'Cr2O7^2-': { Cr: '+6', O: '-2' },
        'NaH': { Na: '+1', H: '-1' },
        'H2O2': { H: '+1', O: '-1' },
        'NH3': { N: '-3', H: '+1' },
        'SO2': { S: '+4', O: '-2' },
        'ClO3^-': { Cl: '+5', O: '-2' }
    };
    
    if (oxidationNumbers[compound]) {
        const data = oxidationNumbers[compound];
        let resultHTML = `<h4>Bilangan Oksidasi ${compound}</h4><div class="oxidation-list">`;
        
        for (const [element, oxNum] of Object.entries(data)) {
            resultHTML += `
                <div class="oxidation-item">
                    <span class="element">${element}:</span>
                    <span class="ox-number">${oxNum}</span>
                </div>
            `;
        }
        
        resultHTML += '</div>';
        oxidationResult.innerHTML = resultHTML;
    } else {
        oxidationResult.innerHTML = `
            <div class="oxidation-error">
                <p>Perhitungan untuk ${compound} belum tersedia.</p>
                <p>Coba: KMnO4, H2SO4, Cr2O7^2-, NaH, H2O2</p>
            </div>
        `;
    }
}

// Balance redox reaction
function balanceRedoxReaction() {
    const reactantsInput = document.getElementById('reactants');
    const productsInput = document.getElementById('products');
    const balancedEquation = document.getElementById('balancedEquation');
    
    if (!reactantsInput || !productsInput || !balancedEquation) return;
    
    const reactants = reactantsInput.value.trim();
    const products = productsInput.value.trim();
    
    // Simple balanced equations for common reactions
    const balancedReactions = {
        'Zn + HCl → ZnCl2 + H2': '1 Zn + 2 HCl → 1 ZnCl₂ + 1 H₂',
        'Fe + O2 → Fe2O3': '4 Fe + 3 O₂ → 2 Fe₂O₃',
        'Al + CuSO4 → Al2(SO4)3 + Cu': '2 Al + 3 CuSO₄ → 1 Al₂(SO₄)₃ + 3 Cu'
    };
    
    const reactionKey = `${reactants} → ${products}`;
    
    if (balancedReactions[reactionKey]) {
        balancedEquation.innerHTML = `
            <h4>Reaksi Setara:</h4>
            <div class="balanced-reaction">
                ${balancedReactions[reactionKey]}
            </div>
            <div class="reaction-analysis">
                <p>Analisis perubahan bilangan oksidasi dan identifikasi oksidator/reduktor dapat dilakukan pada reaksi ini.</p>
            </div>
        `;
    } else {
        balancedEquation.innerHTML = `
            <div class="balance-error">
                <p>Penyeimbangan untuk reaksi ini belum tersedia.</p>
                <p>Coba: Zn + HCl → ZnCl2 + H2</p>
            </div>
        `;
    }
}

// Stoichiometry calculator functions
function showCalcTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.calc-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function calculateMolMass() {
    const formula = document.getElementById('formula-mol-mass').value.trim();
    const mass = parseFloat(document.getElementById('mass-input').value);
    const result = document.getElementById('molMassResult');
    
    // Molecular weights for common compounds
    const molecularWeights = {
        'H2O': 18, 'CO2': 44, 'NaCl': 58.5, 'CaCO3': 100,
        'H2SO4': 98, 'NH3': 17, 'CH4': 16, 'O2': 32, 'N2': 28
    };
    
    const mw = molecularWeights[formula];
    if (!mw) {
        result.innerHTML = '<p>Rumus kimia tidak dikenali. Coba: H2O, CO2, NaCl</p>';
        return;
    }
    
    if (isNaN(mass)) {
        result.innerHTML = '<p>Masukkan nilai massa yang valid.</p>';
        return;
    }
    
    const moles = mass / mw;
    const particles = moles * 6.022e23;
    
    result.innerHTML = `
        <h4>Hasil Perhitungan ${formula}</h4>
        <div class="calc-results">
            <div class="result-item">
                <span>Massa molar:</span>
                <span>${mw} g/mol</span>
            </div>
            <div class="result-item">
                <span>Jumlah mol:</span>
                <span>${moles.toFixed(4)} mol</span>
            </div>
            <div class="result-item">
                <span>Jumlah partikel:</span>
                <span>${particles.toExponential(3)} partikel</span>
            </div>
        </div>
    `;
}

function calculateMolVolume() {
    const moles = parseFloat(document.getElementById('mol-input').value);
    const condition = document.getElementById('gas-condition').value;
    const result = document.getElementById('molVolumeResult');
    
    if (isNaN(moles)) {
        result.innerHTML = '<p>Masukkan nilai mol yang valid.</p>';
        return;
    }
    
    const volume = condition === 'STP' ? moles * 22.4 : moles * 24;
    const conditionText = condition === 'STP' ? 'STP (0°C, 1 atm)' : 'RTP (25°C, 1 atm)';
    
    result.innerHTML = `
        <h4>Hasil Perhitungan Volume Gas</h4>
        <div class="calc-results">
            <div class="result-item">
                <span>Kondisi:</span>
                <span>${conditionText}</span>
            </div>
            <div class="result-item">
                <span>Jumlah mol:</span>
                <span>${moles} mol</span>
            </div>
            <div class="result-item">
                <span>Volume:</span>
                <span>${volume} L</span>
            </div>
        </div>
    `;
}

// Quiz functionality
function startQuiz(type) {
    currentQuiz = {
        type: type,
        questions: [],
        currentQuestion: 0,
        score: 0,
        answers: []
    };
    
    // Load questions based on type
    switch(type) {
        case 'random':
            currentQuiz.questions = getRandomQuestions(25);
            break;
        case 'chapter':
            showChapterSelection();
            return;
        case 'final':
            currentQuiz.questions = getAllQuestions();
            break;
    }
    
    showQuizModal();
    displayQuestion();
}

function getRandomQuestions(count) {
    const allQuestions = [];
    Object.values(quizQuestions).forEach(chapterQuestions => {
        allQuestions.push(...chapterQuestions);
    });
    
    // Shuffle and take first 'count' questions
    return allQuestions.sort(() => 0.5 - Math.random()).slice(0, count);
}

function getAllQuestions() {
    const allQuestions = [];
    Object.values(quizQuestions).forEach(chapterQuestions => {
        allQuestions.push(...chapterQuestions);
    });
    return allQuestions;
}

function showQuizModal() {
    const modal = document.getElementById('quizModal');
    const title = document.getElementById('quizTitle');
    
    modal.style.display = 'block';
    title.textContent = `Quiz - ${currentQuiz.questions.length} Soal`;
    
    updateQuestionCounter();
    startTimer();
}

function displayQuestion() {
    const container = document.getElementById('questionContainer');
    const question = currentQuiz.questions[currentQuiz.currentQuestion];
    
    if (!question) {
        finishQuiz();
        return;
    }
    
    container.innerHTML = `
        <div class="question">
            <h4>Soal ${currentQuiz.currentQuestion + 1}</h4>
            <p>${question.question}</p>
            <div class="options">
                ${question.options.map((option, index) => `
                    <label>
                        <input type="radio" name="answer" value="${index}">
                        ${String.fromCharCode(65 + index)}. ${option}
                    </label>
                `).join('')}
            </div>
        </div>
    `;
    
    // Show/hide navigation buttons
    document.getElementById('prevBtn').disabled = currentQuiz.currentQuestion === 0;
    document.getElementById('nextBtn').style.display = 
        currentQuiz.currentQuestion === currentQuiz.questions.length - 1 ? 'none' : 'block';
    document.getElementById('submitBtn').style.display = 
        currentQuiz.currentQuestion === currentQuiz.questions.length - 1 ? 'block' : 'none';
}

function nextQuestion() {
    saveCurrentAnswer();
    if (currentQuiz.currentQuestion < currentQuiz.questions.length - 1) {
        currentQuiz.currentQuestion++;
        displayQuestion();
        updateQuestionCounter();
    }
}

function prevQuestion() {
    saveCurrentAnswer();
    if (currentQuiz.currentQuestion > 0) {
        currentQuiz.currentQuestion--;
        displayQuestion();
        updateQuestionCounter();
    }
}

function saveCurrentAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) {
        currentQuiz.answers[currentQuiz.currentQuestion] = parseInt(selectedOption.value);
    }
}

function updateQuestionCounter() {
    const counter = document.getElementById('questionCounter');
    counter.textContent = `${currentQuiz.currentQuestion + 1}/${currentQuiz.questions.length}`;
}

function submitQuiz() {
    saveCurrentAnswer();
    finishQuiz();
}

function finishQuiz() {
    // Calculate score
    let correct = 0;
    currentQuiz.questions.forEach((question, index) => {
        if (currentQuiz.answers[index] === question.correct) {
            correct++;
        }
    });
    
    currentQuiz.score = Math.round((correct / currentQuiz.questions.length) * 100);
    
    // Update statistics
    studyProgress.completedQuizzes++;
    studyProgress.averageScore = Math.round(
        (studyProgress.averageScore * (studyProgress.completedQuizzes - 1) + currentQuiz.score) / 
        studyProgress.completedQuizzes
    );
    
    saveProgress();
    updateProgressDisplay();
    
    // Show results
    showQuizResults();
}

function showQuizResults() {
    const container = document.getElementById('questionContainer');
    
    container.innerHTML = `
        <div class="quiz-results">
            <h3>Hasil Quiz</h3>
            <div class="score-display">
                <div class="score-circle">
                    <span class="score-number">${currentQuiz.score}%</span>
                </div>
                <p>${currentQuiz.score >= 80 ? 'Excellent!' : currentQuiz.score >= 60 ? 'Good Job!' : 'Keep Learning!'}</p>
            </div>
            <div class="score-breakdown">
                <div class="stat">
                    <span>Benar:</span>
                    <span>${Math.round(currentQuiz.score * currentQuiz.questions.length / 100)}/${currentQuiz.questions.length}</span>
                </div>
                <div class="stat">
                    <span>Salah:</span>
                    <span>${currentQuiz.questions.length - Math.round(currentQuiz.score * currentQuiz.questions.length / 100)}</span>
                </div>
            </div>
            <button onclick="closeQuiz()" class="quiz-submit">Tutup</button>
        </div>
    `;
    
    // Hide navigation buttons
    document.getElementById('prevBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'none';
}

function closeQuiz() {
    document.getElementById('quizModal').style.display = 'none';
    currentQuiz = null;
}

// Timer functionality
let quizTimer = null;
let timeRemaining = 600; // 10 minutes

function startTimer() {
    timeRemaining = currentQuiz.questions.length * 30; // 30 seconds per question
    updateTimerDisplay();
    
    quizTimer = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(quizTimer);
            finishQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timeRemaining');
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Simulation functions
function openSimulation(simType) {
    const modal = document.getElementById('simulationModal');
    const title = document.getElementById('simTitle');
    const container = document.getElementById('simulationContainer');
    
    modal.style.display = 'block';
    
    switch(simType) {
        case 'atom-builder':
            title.textContent = 'Pembangun Atom';
            container.innerHTML = getAtomBuilderSimulation();
            break;
        case 'bond-formation':
            title.textContent = 'Pembentukan Ikatan';
            container.innerHTML = getBondFormationSimulation();
            break;
        case 'molecular-shapes':
            title.textContent = 'Bentuk Molekul 3D';
            container.innerHTML = getMolecularShapesSimulation();
            break;
        default:
            container.innerHTML = '<p>Simulasi sedang dalam pengembangan...</p>';
    }
}

function getAtomBuilderSimulation() {
    return `
        <div class="atom-builder">
            <div class="builder-controls">
                <h3>Bangun Atom Anda</h3>
                <div class="particle-controls">
                    <div class="particle-control">
                        <label>Proton:</label>
                        <button onclick="changeParticle('proton', -1)">-</button>
                        <span id="protonCount">1</span>
                        <button onclick="changeParticle('proton', 1)">+</button>
                    </div>
                    <div class="particle-control">
                        <label>Neutron:</label>
                        <button onclick="changeParticle('neutron', -1)">-</button>
                        <span id="neutronCount">0</span>
                        <button onclick="changeParticle('neutron', 1)">+</button>
                    </div>
                    <div class="particle-control">
                        <label>Elektron:</label>
                        <button onclick="changeParticle('electron', -1)">-</button>
                        <span id="electronCount">1</span>
                        <button onclick="changeParticle('electron', 1)">+</button>
                    </div>
                </div>
            </div>
            <div class="atom-display" id="builtAtom">
                <!-- Atom visualization will be generated here -->
            </div>
            <div class="atom-properties" id="atomProperties">
                <!-- Atom properties will be displayed here -->
            </div>
        </div>
    `;
}

function getBondFormationSimulation() {
    return `
        <div class="bond-formation-sim">
            <h3>Simulasi Pembentukan Ikatan</h3>
            <div class="atoms-selection">
                <div class="atom-selector">
                    <label>Atom 1:</label>
                    <select id="bondAtom1" onchange="updateBondSimulation()">
                        <option value="Na">Natrium (Na)</option>
                        <option value="Cl">Klorin (Cl)</option>
                        <option value="H">Hidrogen (H)</option>
                        <option value="O">Oksigen (O)</option>
                    </select>
                </div>
                <div class="atom-selector">
                    <label>Atom 2:</label>
                    <select id="bondAtom2" onchange="updateBondSimulation()">
                        <option value="Cl">Klorin (Cl)</option>
                        <option value="Na">Natrium (Na)</option>
                        <option value="H">Hidrogen (H)</option>
                        <option value="O">Oksigen (O)</option>
                    </select>
                </div>
            </div>
            <div class="bond-animation" id="bondAnimation">
                <!-- Bond formation animation -->
            </div>
            <div class="bond-explanation" id="bondExplanation">
                <!-- Explanation of bond formation -->
            </div>
        </div>
    `;
}

function getMolecularShapesSimulation() {
    return `
        <div class="molecular-shapes-sim">
            <h3>Eksplorasi Bentuk Molekul 3D</h3>
            <div class="shape-controls">
                <label>Pilih Molekul:</label>
                <select id="shapeSimMolecule" onchange="update3DShape()">
                    <option value="CH4">Metana (CH₄)</option>
                    <option value="NH3">Amonia (NH₃)</option>
                    <option value="H2O">Air (H₂O)</option>
                    <option value="BF3">Boron Trifluorida (BF₃)</option>
                    <option value="SF6">Sulfur Heksafluorida (SF₆)</option>
                </select>
            </div>
            <div class="shape-3d-display" id="shape3DDisplay">
                <!-- 3D molecular shape display -->
            </div>
            <div class="shape-info" id="shapeInfo">
                <!-- Molecular shape information -->
            </div>
        </div>
    `;
}

function closeSimulation() {
    document.getElementById('simulationModal').style.display = 'none';
}

// Notes functionality
function openNotesModal() {
    document.getElementById('notesModal').style.display = 'block';
    loadNotes();
}

function saveNote() {
    const noteText = document.getElementById('noteText').value.trim();
    const category = document.getElementById('noteCategory').value;
    
    if (!noteText) return;
    
    const note = {
        id: Date.now(),
        text: noteText,
        category: category,
        timestamp: new Date().toLocaleString('id-ID')
    };
    
    userNotes.push(note);
    localStorage.setItem('userNotes', JSON.stringify(userNotes));
    
    document.getElementById('noteText').value = '';
    loadNotes();
}

function loadNotes() {
    const notesList = document.getElementById('notesList');
    if (!notesList) return;
    
    notesList.innerHTML = '';
    
    if (userNotes.length === 0) {
        notesList.innerHTML = '<p>Belum ada catatan. Tambahkan catatan pertama Anda!</p>';
        return;
    }
    
    userNotes.reverse().forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.innerHTML = `
            <div class="note-header">
                <span class="note-category">${getCategoryName(note.category)}</span>
                <span class="note-timestamp">${note.timestamp}</span>
                <button onclick="deleteNote(${note.id})" class="delete-note">×</button>
            </div>
            <div class="note-content">${note.text}</div>
        `;
        notesList.appendChild(noteElement);
    });
}

function getCategoryName(category) {
    const categories = {
        'general': 'Umum',
        'bab1': 'Bab 1: Struktur Atom',
        'bab2': 'Bab 2: Ikatan Kimia',
        'bab3': 'Bab 3: Bentuk Molekul',
        'bab4': 'Bab 4: Larutan Elektrolit',
        'bab5': 'Bab 5: Reaksi Redoks',
        'bab6': 'Bab 6: Stoikiometri'
    };
    return categories[category] || category;
}

function deleteNote(noteId) {
    userNotes = userNotes.filter(note => note.id !== noteId);
    localStorage.setItem('userNotes', JSON.stringify(userNotes));
    loadNotes();
}

// Progress tracking
function markChapterAsVisited(chapter) {
    if (!studyProgress.chapterProgress[chapter]) {
        studyProgress.chapterProgress[chapter] = 25; // 25% for visiting
    }
    saveProgress();
    updateProgressDisplay();
}

function markChapterAsCompleted(chapter) {
    studyProgress.chapterProgress[chapter] = 100;
    saveProgress();
    updateProgressDisplay();
}

function saveProgress() {
    localStorage.setItem('studyProgress', JSON.stringify(studyProgress));
}

function loadProgress() {
    const saved = localStorage.getItem('studyProgress');
    if (saved) {
        studyProgress = JSON.parse(saved);
    }
    updateProgressDisplay();
}

function updateProgressDisplay() {
    // Update chapter progress circles
    Object.keys(studyProgress.chapterProgress || {}).forEach(chapter => {
        const progress = studyProgress.chapterProgress[chapter];
        const progressCircle = document.querySelector(`[data-chapter="${chapter}"] .progress-circle span`);
        if (progressCircle) {
            progressCircle.textContent = `${progress}%`;
        }
    });
    
    // Update statistics
    const completedQuizzesEl = document.getElementById('completedQuizzes');
    const averageScoreEl = document.getElementById('averageScore');
    const studyTimeEl = document.getElementById('studyTime');
    
    if (completedQuizzesEl) completedQuizzesEl.textContent = studyProgress.completedQuizzes || 0;
    if (averageScoreEl) averageScoreEl.textContent = `${studyProgress.averageScore || 0}%`;
    if (studyTimeEl) studyTimeEl.textContent = Math.round((studyProgress.totalTime || 0) / 60);
}

// Dark mode toggle
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function handleKeyboardShortcuts(e) {
    // Ctrl + N for new note
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        openNotesModal();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
}

// Auto-save functionality
function autoSaveNote() {
    const noteText = document.getElementById('noteText').value.trim();
    if (noteText) {
        localStorage.setItem('autoSavedNote', noteText);
    }
}

// Track study time
let studyStartTime = Date.now();
setInterval(() => {
    const sessionTime = Math.floor((Date.now() - studyStartTime) / 60000); // minutes
    studyProgress.totalTime = (studyProgress.totalTime || 0) + 1;
    if (sessionTime % 5 === 0) { // Save every 5 minutes
        saveProgress();
    }
}, 60000); // Every minute

// Initialize tooltips and help system
function initializeTooltips() {
    // Add tooltips to interactive elements
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - 30) + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Performance optimization
function lazyLoadContent() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chapter = entry.target.id;
                loadChapterContent(chapter);
                observer.unobserve(entry.target);
            }
        });
    });
    
    document.querySelectorAll('.chapter').forEach(chapter => {
        observer.observe(chapter);
    });
}

function loadChapterContent(chapterId) {
    // Load heavy content only when chapter becomes visible
    const chapter = document.getElementById(chapterId);
    if (chapter && !chapter.dataset.loaded) {
        // Mark as loaded
        chapter.dataset.loaded = 'true';
        
        // Initialize chapter-specific functionality
        switch(chapterId) {
            case 'bab1':
                // Initialize periodic table if not already done
                if (!document.querySelector('.element')) {
                    generatePeriodicTable();
                }
                break;
            case 'bab2':
                // Initialize Lewis structure examples
                break;
            // Add more chapter-specific initializations
        }
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    lazyLoadContent();
    initializeTooltips();
});
