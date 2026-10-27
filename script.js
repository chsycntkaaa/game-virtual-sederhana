// Data Status Karakter & Game
let player = {
    name: "Budi",
    energy: 100,
    grades: 75,
    mood: 100,
    money: 50000,
    day: 1,
    hairStyle: "short",
    shirtColor: "#89b4fa",
    hasGlasses: false
};

// Elemen DOM
const charNameDisplay = document.getElementById('char-name-display');
const energyBar = document.getElementById('energy-bar');
const energyVal = document.getElementById('energy-val');
const gradesBar = document.getElementById('grades-bar');
const gradesVal = document.getElementById('grades-val');
const moodBar = document.getElementById('mood-bar');
const moodVal = document.getElementById('mood-val');
const moneyVal = document.getElementById('money-val');
const dayDisplay = document.getElementById('day-display');
const storyText = document.getElementById('story-text');
const speechBubble = document.getElementById('speech-bubble');

// SVG Elements
const svgShirt = document.getElementById('svg-shirt');
const svgHair = document.getElementById('svg-hair');
const svgGlasses = document.getElementById('svg-glasses');
const svgMouth = document.getElementById('svg-mouth');
const eyebrowL = document.getElementById('eyebrow-l');
const eyebrowR = document.getElementById('eyebrow-r');
const statusIcon = document.getElementById('status-icon');

// Modals
const customizeModal = document.getElementById('customize-modal');
const modalOverlay = document.getElementById('modal-overlay');

// 1. Memperbarui Logika Statistik & Ekspresi Visual SVG
function updateUI() {
    // Pengamanan Batas Nilai (0 - 100)
    player.energy = Math.min(100, Math.max(0, player.energy));
    player.grades = Math.min(100, Math.max(0, player.grades));
    player.mood = Math.min(100, Math.max(0, player.mood));

    // Update Teks & Bar Progress
    charNameDisplay.textContent = player.name;
    energyBar.style.width = player.energy + '%';
    energyVal.textContent = player.energy + '%';
    gradesBar.style.width = player.grades + '%';
    gradesVal.textContent = player.grades;
    moodBar.style.width = player.mood + '%';
    moodVal.textContent = player.mood + '%';
    moneyVal.textContent = `Rp ${player.money.toLocaleString('id-ID')}`;
    dayDisplay.textContent = `Hari ke-${player.day}`;

    // Update Ekspresi Karakter berdasarkan Status
    updateCharacterExpression();

    // Cek Kondisi Kalah / Menang
    checkStatus();
}

// 2. Logika Ekspresi Wajah Karakter (SVG Dynamics)
function updateCharacterExpression() {
    // Default: Senyum & Alis Normal
    let mouthPath = "M 88 98 Q 100 110 112 98";
    let eyebrowLPath = "M 72 70 Q 80 67 88 70";
    let eyebrowRPath = "M 112 70 Q 120 67 128 70";
    statusIcon.classList.add('hidden');

    // Kondisi Lelah (Energi Rendah)
    if (player.energy <= 30) {
        mouthPath = "M 88 105 Q 100 98 112 105"; // Mulut Datar/Kecewa
        eyebrowLPath = "M 72 73 Q 80 73 88 70";
        eyebrowRPath = "M 112 70 Q 120 73 128 73";
        statusIcon.textContent = "💤";
        statusIcon.classList.remove('hidden');
    }
    // Kondisi Stres (Mood Rendah)
    else if (player.mood <= 30) {
        mouthPath = "M 88 108 Q 100 95 112 108"; // Mulut Cemberut
        eyebrowLPath = "M 72 65 Q 80 70 88 73";  // Alis Miring Sedih/Stres
        eyebrowRPath = "M 112 73 Q 120 70 128 65";
        statusIcon.textContent = "💢";
        statusIcon.classList.remove('hidden');
    }

    // Terapkan Path SVG
    svgMouth.setAttribute('d', mouthPath);
    eyebrowL.setAttribute('d', eyebrowLPath);
    eyebrowR.setAttribute('d', eyebrowRPath);

    // Kacamata otomatis jika pinter / dicentang
    if (player.hasGlasses || player.grades >= 85) {
        svgGlasses.classList.remove('hidden');
    } else {
        svgGlasses.classList.add('hidden');
    }

    // Warna Baju & Rambut
    svgShirt.setAttribute('fill', player.shirtColor);
    updateHairPath(player.hairStyle);
}

// Mengubah Bentuk Rambut SVG
function updateHairPath(style) {
    if (style === "wavy") {
        svgHair.setAttribute('d', "M 50 85 Q 45 30 100 25 Q 155 30 150 85 Q 135 45 100 50 Q 65 45 50 85 Z");
    } else if (style === "bun") {
        svgHair.setAttribute('d', "M 85 25 Q 100 5 115 25 Q 150 35 148 80 Q 130 55 100 60 Q 70 55 52 80 Q 50 35 85 25 Z");
    } else {
        // Short Default
        svgHair.setAttribute('d', "M 52 80 Q 50 35 100 35 Q 150 35 148 80 Q 130 55 100 60 Q 70 55 52 80 Z");
    }
}

// 3. Eksekusi Tombol Aksi
function doAction(actionType) {
    if (player.day > 7) return;

    switch(actionType) {
        case 'study':
            player.energy -= 25;
            player.grades += 10;
            player.mood -= 10;
            storyText.textContent = "Kamu belajar tekun seharian. Nilai ujian meningkat!";
            speechBubble.textContent = "Otakku rasanya mau meledak, tapi nilaiku aman!";
            break;
        case 'rest':
            player.energy += 40;
            player.mood += 10;
            storyText.textContent = "Kamu tidur nyenyak. Badan kembali segar!";
            speechBubble.textContent = "Hoam... Tidur sebentar memang yang terbaik!";
            break;
        case 'play':
            player.energy -= 10;
            player.mood += 25;
            player.money -= 15000;
            storyText.textContent = "Kamu main game online sambil jajan snack. Mood naik drastis!";
            speechBubble.textContent = "Seru banget gamenya! Tapi dompet agak tipis...";
            break;
        case 'work':
            player.energy -= 30;
            player.mood -= 15;
            player.money += 40000;
            storyText.textContent = "Kamu mengambil tugas freelance online. Uang saku bertambah!";
            speechBubble.textContent = "Lumayan buat bayar kost dan beli camilan!";
            break;
    }

    player.day++;
    updateUI();
}

// Dialog saat Karakter Diklik
function triggerCharTalk() {
    const quotes = [
        "Ada apa? Jangan lupa cek bar energiku ya!",
        "Semoga ujian minggu ini berjalan lancar!",
        "Kalau aku kelelahan, ajak aku tidur dulu ya.",
        "Ayo kustomisasi bajuku dari tombol atas!"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    speechBubble.textContent = randomQuote;
}

// 4. Fitur Modal Kustomisasi
function openCustomizeModal() {
    document.getElementById('input-name').value = player.name;
    document.getElementById('select-hair').value = player.hairStyle;
    document.getElementById('input-shirt-color').value = player.shirtColor;
    document.getElementById('check-glasses').checked = player.hasGlasses;
    customizeModal.classList.remove('hidden');
}

function previewCharacter() {
    const tempHair = document.getElementById('select-hair').value;
    const tempColor = document.getElementById('input-shirt-color').value;
    const tempGlasses = document.getElementById('check-glasses').checked;

    svgShirt.setAttribute('fill', tempColor);
    updateHairPath(tempHair);
    if (tempGlasses || player.grades >= 85) {
        svgGlasses.classList.remove('hidden');
    } else {
        svgGlasses.classList.add('hidden');
    }
}

function saveCustomization() {
    player.name = document.getElementById('input-name').value || "Karakter";
    player.hairStyle = document.getElementById('select-hair').value;
    player.shirtColor = document.getElementById('input-shirt-color').value;
    player.hasGlasses = document.getElementById('check-glasses').checked;

    customizeModal.classList.add('hidden');
    updateUI();
}

// 5. Evaluasi Akhir Game
function checkStatus() {
    if (player.energy <= 0) {
        endGame("Kelelahan Ekstrem!", `${player.name} pingsan karena kehabisan energi. Istirahat itu penting!`);
    } else if (player.mood <= 0) {
        endGame("Burnout!", `${player.name} mengalami stres berat dan tidak bisa lanjut ujian.`);
    } else if (player.money < 0) {
        endGame("Kehabisan Uang!", "Keuangan minus! Kamu tidak bisa membeli makanan.");
    } else if (player.day > 7) {
        if (player.grades >= 80) {
            endGame("Lulus Berprestasi! 🎉", `Selamat! ${player.name} lulus pekan ujian dengan GPA ${player.grades}!`);
        } else {
            endGame("Ujian Remidi 😅", `Pekan ujian selesai. Nilai ${player.name} hanya ${player.grades}, harus remidi.`);
        }
    }
}

function endGame(title, desc) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-desc').textContent = desc;
    modalOverlay.classList.remove('hidden');
}

function resetGame() {
    player.energy = 100;
    player.grades = 75;
    player.mood = 100;
    player.money = 50000;
    player.day = 1;
    storyText.textContent = "Selamat datang kembali! Mari atur strategi baru untuk pekan ujian ini.";
    speechBubble.textContent = "Mari kita mulai lagi dari Hari ke-1!";
    modalOverlay.classList.add('hidden');
    updateUI();
}

// Inisialisasi awal
updateUI();
