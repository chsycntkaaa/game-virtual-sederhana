/**
 * TTS (Teka-Teki Silang) Engine
 */

const GRID_SIZE = 7;

// --- WEB AUDIO API (SYNTH SOUND GENERATOR) ---
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) audioCtx = new AudioCtx();
}

function playSound(type) {
  try {
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'type') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch (e) {
    console.error("Audio Error:", e);
  }
}

// --- PUZZLE DATA CONFIGURATION ---
const puzzleData = {
  words: [
    { id: 1, number: 1, direction: "horizontal", row: 0, col: 0, answer: "JAKARTA", clue: "1. Ibu kota negara Indonesia" },
    { id: 2, number: 2, direction: "vertical", row: 0, col: 0, clue: "2. Hewan mamalia air bernapas dengan paru-paru", answer: "PAUS" },
    { id: 3, number: 3, direction: "vertical", row: 0, col: 4, clue: "3. Alat musik tradisional angklung berasal dari sini", answer: "JAWA" },
    { id: 4, number: 4, direction: "horizontal", row: 3, col: 1, clue: "4. Planet terbesar di tata surya", answer: "JUPITER" }
  ]
};

// --- BUILD GRID & CLUES ---
const gridContainer = document.getElementById("tts-grid");
const cluesHContainer = document.getElementById("clues-horizontal");
const cluesVContainer = document.getElementById("clues-vertical");

let cellsMatrix = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));

function initTTS() {
  gridContainer.style.gridTemplateColumns = `repeat(${GRID_SIZE}, minmax(0, 1fr))`;
  gridContainer.innerHTML = "";

  // 1. Buat Matrix Sel Kosong
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.className = "tts-cell blocked";
      input.dataset.row = r;
      input.dataset.col = c;
      
      cellsMatrix[r][c] = {
        element: input,
        active: false,
        number: null,
        correctChar: ""
      };

      gridContainer.appendChild(input);
    }
  }

  // 2. Petakan Kata ke Matrix
  puzzleData.words.forEach(word => {
    let r = word.row;
    let c = word.col;

    // Tandai nomor awal kata
    if (!cellsMatrix[r][c].number) {
      cellsMatrix[r][c].number = word.number;
    }

    for (let i = 0; i < word.answer.length; i++) {
      const cellObj = cellsMatrix[r][c];
      cellObj.active = true;
      cellObj.correctChar = word.answer[i];
      cellObj.element.classList.remove("blocked");

      // Tambahkan angka penunjuk kecil jika ada
      if (cellObj.number && !cellObj.element.querySelector('.cell-number')) {
        const numSpan = document.createElement("span");
        numSpan.className = "cell-number";
        numSpan.textContent = cellObj.number;
        cellObj.element.appendChild(numSpan);
      }

      if (word.direction === "horizontal") c++;
      else r++;
    }
  });

  // 3. Render Daftar Pertanyaan (Clues)
  cluesHContainer.innerHTML = "";
  cluesVContainer.innerHTML = "";

  puzzleData.words.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word.clue;
    if (word.direction === "horizontal") {
      cluesHContainer.appendChild(li);
    } else {
      cluesVContainer.appendChild(li);
    }
  });

  // 4. Event Listener Input Keyboard & Navigasi
  document.querySelectorAll(".tts-cell:not(.blocked)").forEach(input => {
    input.addEventListener("input", (e) => {
      const val = e.target.value.toUpperCase();
      e.target.value = val;
      if (val) {
        playSound('type');
        // Pindah otomatis ke sel berikutnya secara horizontal
        const r = parseInt(e.target.dataset.row);
        const c = parseInt(e.target.dataset.col);
        if (c + 1 < GRID_SIZE && !cellsMatrix[r][c + 1].element.classList.contains("blocked")) {
          cellsMatrix[r][c + 1].element.focus();
        }
      }
    });

    input.addEventListener("keydown", (e) => {
      const r = parseInt(e.target.dataset.row);
      const c = parseInt(e.target.dataset.col);

      if (e.key === "Backspace" && !e.target.value) {
        if (c - 1 >= 0 && !cellsMatrix[r][c - 1].element.classList.contains("blocked")) {
          cellsMatrix[r][c - 1].element.focus();
        }
      }
    });
  });
}

// --- CEK JAWABAN ---
document.getElementById("btn-check").onclick = () => {
  let allCorrect = true;
  let filledCount = 0;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = cellsMatrix[r][c];
      if (cell.active) {
        const userVal = cell.element.value;
        if (userVal) filledCount++;

        if (userVal === cell.correctChar) {
          cell.element.classList.add("correct");
          cell.element.classList.remove("incorrect");
        } else {
          cell.element.classList.add("incorrect");
          cell.element.classList.remove("correct");
          allCorrect = false;
        }
      }
    }
  }

  if (allCorrect && filledCount > 0) {
    playSound('success');
    alert("🎉 Luar biasa! Semua jawaban TTS benar!");
  } else {
    playSound('error');
  }
};

// --- RESET GAME ---
document.getElementById("btn-reset").onclick = () => {
  initTTS();
};

// Inisialisasi awal saat dimuat
initTTS();
