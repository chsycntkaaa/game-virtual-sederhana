// Data Status Player
let player = {
    energy: 100,
    grades: 75,
    mood: 100,
    money: 50000,
    day: 1
};

// Elemen DOM (UI)
const energyBar = document.getElementById('energy-bar');
const energyVal = document.getElementById('energy-val');
const gradesBar = document.getElementById('grades-bar');
const gradesVal = document.getElementById('grades-val');
const moodBar = document.getElementById('mood-bar');
const moodVal = document.getElementById('mood-val');
const moneyVal = document.getElementById('money-val');
const dayDisplay = document.getElementById('day-display');
const storyText = document.getElementById('story-text');

const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');

// Fungsi Memperbarui Tampilan UI
function updateUI() {
    // Pengamanan batas angka (0 - 100)
    player.energy = Math.min(100, Math.max(0, player.energy));
    player.grades = Math.min(100, Math.max(0, player.grades));
    player.mood = Math.min(100, Math.max(0, player.mood));

    // Update Bar Visual
    energyBar.style.width = player.energy + '%';
    energyVal.textContent = player.energy + '%';

    gradesBar.style.width = player.grades + '%';
    gradesVal.textContent = player.grades;

    moodBar.style.width = player.mood + '%';
    moodVal.textContent = player.mood + '%';

    // Update Teks
    moneyVal.textContent = `Rp ${player.money.toLocaleString('id-ID')}`;
    dayDisplay.textContent = `Hari ke-${player.day}`;

    // Cek Kondisi Game Over atau Menang
    checkStatus();
}

// Logika Tombol Aksi
function doAction(actionType) {
    if (player.day > 7) return;

    switch(actionType) {
        case 'study':
            player.energy -= 25;
            player.grades += 10;
            player.mood -= 10;
            storyText.textContent = "Kamu belajar tekun seharian. Nilai naik, tapi kepala agak pusing dan energi berkurang.";
            break;
        case 'rest':
            player.energy += 40;
            player.mood += 10;
            storyText.textContent = "Kamu tidur nyenyak dan mengistirahatkan pikiran. Badan terasa segar kembali!";
            break;
        case 'play':
            player.energy -= 10;
            player.mood += 25;
            player.money -= 15000;
            storyText.textContent = "Kamu main game online sambil jajan snack. Mood naik drastis, tapi dompet menipis.";
            break;
        case 'work':
            player.energy -= 30;
            player.mood -= 15;
            player.money += 40000;
            storyText.textContent = "Kamu menyelesaikan tugas freelance sederhana. Uang saku bertambah!";
            break;
    }

    // Tambah Hari Setiap Aksi
    player.day++;
    updateUI();
}

// Cek Evaluasi Game
function checkStatus() {
    // Kondisi Kalah
    if (player.energy <= 0) {
        endGame("Kelelahan Ekstrem!", "Kamu pingsan karena kehabisan energi. Jangan lupa istirahat!");
    } else if (player.mood <= 0) {
        endGame("Burnout!", "Kamu mengalami burnout berat dan tidak bisa melanjutkan pekan ujian.");
    } else if (player.money < 0) {
        endGame("Kehabisan Uang!", "Kamu tidak bisa membeli makan lagi karena tabungan minus.");
    } 
    // Kondisi Selesai (Satu Minggu / 7 Hari)
    else if (player.day > 7) {
        if (player.grades >= 80) {
            endGame("Lulus Penuh Prestasi! 🎉", `Selamat! Kamu berhasil melewati seminggu dengan Nilai Akhir: ${player.grades}. Manajemen waktumu luar biasa!`);
        } else {
            endGame("Ujian Remidi 😅", `Pekan ujian selesai, namun nilai akhirmu hanya ${player.grades}. Belajar lebih giat lagi ya!`);
        }
    }
}

// Tampilkan Modal Game Over / Menang
function endGame(title, description) {
    modalTitle.textContent = title;
    modalDesc.textContent = description;
    modalOverlay.classList.remove('hidden');
}

// Reset Game
function resetGame() {
    player = {
        energy: 100,
        grades: 75,
        mood: 100,
        money: 50000,
        day: 1
    };
    storyText.textContent = "Selamat datang kembali! Mari atur strategi baru untuk pekan ujian ini.";
    modalOverlay.classList.add('hidden');
    updateUI();
}

// Inisialisasi awal saat halaman di-load
updateUI();
