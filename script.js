/* ========================================
   RAMADAN CODE QUEST - GAME LOGIC
   ======================================== */

// ==========================================
// GAME DATA
// ==========================================
 document.title = "Ramadan Treasure";
const STAGE_KEYS = {
  1: '04c24a00c8e5cee2bed6f9ac6ae4e1e9a5bdb6d4e980069fbfd2d293a5873d41',
  2: 'e91d9bd804d67de71a382b53a055a5ddf524f79614d7051d47f47acfe1f1ee0d',
  3: '76a5099a70badb193d7380b5a29b3f9656f49b8ce9dba45157c8579400f5760a'
};

// Stage 1: Word Grid Data (dynamic generation)
const GRID_SIZE = 5;
const STAGE1_WORDS = ['CODE', 'WEB', 'BUG', 'JAVA', 'HTML'];
const DIRECTIONS = [
  { dr: 0, dc: 1 },   // horizontal right
  { dr: 0, dc: -1 },  // horizontal left (reverse)
  { dr: 1, dc: 0 },   // vertical down
  { dr: -1, dc: 0 },  // vertical up (reverse)
];
const FILLER_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Stage 1 timer duration (seconds)
const STAGE1_TIME_LIMIT = 20;

// Stage 1: Score tiers based on attempt count
const STAGE1_SCORE_TIERS = [20, 15, 10, 10];

// Stage 2: Image Clues Data
const IMAGE_CLUES = [
  {
    image: 'images/1.png',
    description: `In a very special competition,
nothing was written down…
instead, its story saved in a small circle,
replaying the memories whenever it’s opened.`,
    questions: [
      { question: 'What is the name of the lab Fares exited?', answer: '916b958adc78c4dd5996b8a6ac00735206ca5b2c6068af71a70693a90f816c1c' },
      { question: 'how much time did he say he needed during the phone call?', answer: '673cff7cebb31a9cd0642e3cec0a85321011216501643f86024185cb32918bce' }
    ],
    hint: 'The answers are inside the saved story highlight.'
  },
  {
    image: 'images/2.png',
    description: `Some information is in a place that is mostly blue.
This is where news and achievements are shared.
Start there…
The social media page is your first clue.
Then keep looking.
Go back to the year 2014,
when a big challenge happened.
Only one team won.
There, you will find the full story.`,
    questions: [
      { question: 'What is the official email of the academy?', answer: '17b1fd25f6a0275d3503ee759547cffee11afe5719039bc31dc42ee64e78e56b' },
      { question: 'What is the name of the team that won the ACM-PCPC competition in 2014?', answer: '42cb4e6f84970e97d515b9d57dfd4e4fef5d482061b7d2c33179f2ad76495e11' },
      { question: 'How many problems did the winning team solve?', answer: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a' },
      { question: 'What are the names of the other teams from the university that participated in the competition?', answer: 'c953aa5d54d340dd10a32bfbc2c9f886207e550f4a4a94f01171d2483d31717c' }
    ],
    hint: 'On our Facebook page, try using the filter feature to find the post quickly'
  },
  {
    image: 'images/3.png',
    description: `In one season of the year,
special guests visit the university for a limited time.
They are not its regular students.
In one of those circles where you found the first clue, the answer is waiting for you.
Do not give up, and explore all the circles carefully.`,
    questions: [
      { question: 'What is the name of the girl who won first place?', answer: 'a1152afebc06b268e79c1def5c8c70ac24d4e363430ad69a4fe883264cfae6db' },
      { question: 'How many points did she score?', answer: '09895de0407bcb0386733daa14bdb5dfa544505530c634334a05a60f161b71fc' }
    ],
    hint: 'Check the Future Coder highlight'
  }
];

// Stage 2 base points per image (not per question)
const STAGE2_BASE_POINTS = 20;
const zipLink ="https://drive.google.com/uc?export=download&id=1KhfUdu16L-4tPQwx9hRzYSrjrLwwKseJ"
const imgLink="https://drive.google.com/uc?export=download&id=1zJQFiR3zn0jWY-VP4pqxXCBD78d0crsg"
// Stage 3: Scenario Data
const SCENARIOS = [
  {
    title: 'The Hidden Message',
    image: 'images/4.png',
    description: `To find the flag, first download this file: 
      <a href="${zipLink}" target="_blank">[Download ZIP File]</a>. 
      But be careful – the file has a password. The first step to find it is to look closely at the attached image. 
      The suspicious IP in the image will show you the next step. 
      This GitHub link <a href="https://github.com/RTreasure26/Flag-Discovery" target="_blank">GitHub Repository</a> 
      has files that will help you follow the right path and finish the challenge. 
      Make sure to use a program that can open password-protected ZIP files, like <strong>WinRAR</strong>.
    `,
    questions: [
      { question: 'Enter the flag', flag: '231962cf73caf434dd38e9edb9c713a6cf3e8091d7aa577b35703d91883fbdea' },
  
    ],
    hintText: 'The flag is Base64 encoded.'
  },
  {
    title: 'Secret of the Triangle',
    image: 'images/5.png',
    description: `Open this image<a href="${imgLink}" target="_blank">[Download image File]</a> and remember: sometimes what we see with our eyes is not what we read, and secrets often hide at the very end.`,
    questions: [
      { question: 'Enter the flag', flag: '8c57686b384d82a5ec9a915435d3fc1b67feb19bd892842e0e1d24b86e2342f5' },
    
    ],
    hintText: 'Open the image in a text editor to find the flag'
  }
];

// Stage 3 base points per scenario (not per question)
const STAGE3_BASE_POINTS = 25;

// Hint cost
const HINT_COST = 5;

// ==========================================
// GAME STATE
// ==========================================

const state = {
  currentScreen: 'home-screen',
  totalScore: 0,
  stages: {
    1: { unlocked: false, completed: false },
    2: { unlocked: false, completed: false },
    3: { unlocked: false, completed: false }
  },
  stage1: {
    foundWords: [],
    selectedCells: [],
    isSelecting: false,
    attempts: 0,
    scored: false,
    grid: null,
    timerValue: STAGE1_TIME_LIMIT,
    timerInterval: null,
    timerExpired: false
  },
  stage2: {
    // Track solved questions per image: { imageIndex: [qIndex, ...] }
    solvedQuestions: {},
    // Track which images are fully solved
    solvedImages: [],
    // Track hint usage per image (not per question)
    hintUsed: {}
  },
  stage3: {
    // Track solved questions per scenario: { scenarioIndex: [qIndex, ...] }
    solvedQuestions: {},
    // Track which scenarios are fully solved
    solvedScenarios: [],
    // Track hint usage per scenario (not per question)
    hintUsed: {}
  },
  muted: false
};
const STORAGE_KEY = 'ramadan_code_quest_state';

function saveGameState() {
  try {
    const dataToSave = {
      totalScore: state.totalScore,
      stages: state.stages,
      stage2: {
        solvedQuestions: state.stage2.solvedQuestions,
        solvedImages: state.stage2.solvedImages,
        hintUsed: state.stage2.hintUsed
      },
      stage3: {
        solvedQuestions: state.stage3.solvedQuestions,
        solvedScenarios: state.stage3.solvedScenarios,
        hintUsed: state.stage3.hintUsed
      },
      muted: state.muted
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    console.error("Could not save game state", e);
  }
}

function loadGameState() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      state.totalScore = parsedData.totalScore || 0;
      state.stages = parsedData.stages || state.stages;
      state.muted = parsedData.muted !== undefined ? parsedData.muted : state.muted;
      if (parsedData.stage2) {
        state.stage2.solvedQuestions = parsedData.stage2.solvedQuestions || {};
        state.stage2.solvedImages = parsedData.stage2.solvedImages || [];
        state.stage2.hintUsed = parsedData.stage2.hintUsed || {};
      }
      if (parsedData.stage3) {
        state.stage3.solvedQuestions = parsedData.stage3.solvedQuestions || {};
        state.stage3.solvedScenarios = parsedData.stage3.solvedScenarios || [];
        state.stage3.hintUsed = parsedData.stage3.hintUsed || {};
      }
      return true;
    }
  } catch (e) {
    console.error("Could not load game state", e);
  }
  return false;
}

// ==========================================
// SCORE SYSTEM
// ==========================================

function addScore(points) {
  state.totalScore += points;
  if (state.totalScore < 0) state.totalScore = 0;
  updateAllScoreDisplays();
  saveGameState(); // SAVE PROGRESS
}

function updateAllScoreDisplays() {
  document.querySelectorAll('.score-display').forEach(el => {
    el.textContent = state.totalScore;
  });
}

// ==========================================
// AUDIO SYSTEM (Web Audio API)
// ==========================================

let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.15) {
  if (state.muted) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) { /* Silently fail */ }
}

function playSelectSound() {
  playTone(600, 0.08, 'sine', 0.1);
}

function playCorrectSound() {
  playTone(523, 0.15, 'sine', 0.12);
  setTimeout(() => playTone(659, 0.15, 'sine', 0.12), 100);
  setTimeout(() => playTone(784, 0.25, 'sine', 0.12), 200);
}

function playWrongSound() {
  playTone(200, 0.3, 'sawtooth', 0.08);
}

function playHintSound() {
  playTone(440, 0.15, 'triangle', 0.1);
  setTimeout(() => playTone(350, 0.2, 'triangle', 0.08), 100);
}

function playTimerTickSound() {
  playTone(880, 0.05, 'square', 0.06);
}

function playTimeUpSound() {
  playTone(150, 0.5, 'sawtooth', 0.12);
  setTimeout(() => playTone(100, 0.6, 'sawtooth', 0.1), 200);
}

function playUnlockSound() {
  playTone(440, 0.12, 'sine', 0.12);
  setTimeout(() => playTone(554, 0.12, 'sine', 0.12), 80);
  setTimeout(() => playTone(659, 0.12, 'sine', 0.12), 160);
  setTimeout(() => playTone(880, 0.3, 'sine', 0.12), 240);
}

function playCompletionSound() {
  const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.1), i * 80);
  });
}

// Background music
let bgMusicInterval = null;
function startBgMusic() {
  if (bgMusicInterval) return;
  const melody = [330, 392, 440, 392, 330, 294, 262, 294, 330, 392, 440, 523];
  let idx = 0;
  bgMusicInterval = setInterval(() => {
    if (!state.muted) {
      playTone(melody[idx % melody.length], 0.6, 'sine', 0.03);
    }
    idx++;
  }, 800);
}

function stopBgMusic() {
  if (bgMusicInterval) {
    clearInterval(bgMusicInterval);
    bgMusicInterval = null;
  }
}

// ==========================================
// CONFETTI SYSTEM
// ==========================================

const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiAnimId = null;

function resizeConfettiCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function createConfetti(count = 80) {
  resizeConfettiCanvas();
  const colors = ['#d4a33e', '#f0c96e', '#2ec4a0', '#4ecb71', '#e54b4b', '#faf3e0'];
  confettiPieces = [];
  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height * -1,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    });
  }
  animateConfetti();
}

function animateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  let active = false;
  confettiPieces.forEach(p => {
    if (p.y < confettiCanvas.height + 20) {
      active = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.rotation += p.rotationSpeed;
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      confettiCtx.restore();
    }
  });
  if (active) {
    confettiAnimId = requestAnimationFrame(animateConfetti);
  } else {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiAnimId = null;
  }
}

function fireConfetti() {
  if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
  createConfetti(100);
}

// ==========================================
// TOAST SYSTEM
// ==========================================

let toastTimeout = null;

function showToast(message, type = 'info', duration = 2000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  void toast.offsetWidth;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ==========================================
// SCREEN NAVIGATION
// ==========================================

function showScreen(screenId) {
  if (state.currentScreen === 'stage1-screen' && screenId !== 'stage1-screen') {
    stopStage1Timer();
  }
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    state.currentScreen = screenId;
  }
  updateAllScoreDisplays();
}

// ==========================================
// MAP MANAGEMENT
// ==========================================

function updateMapUI() {
  let completedCount = 0;
  [1, 2, 3].forEach(stageNum => {
    const card = document.querySelector(`.stage-card[data-stage="${stageNum}"]`);
    const keyGroup = card.querySelector('.key-input-group');
    const playBtn = card.querySelector('.btn-play');
    const badge = card.querySelector('.stage-complete-badge');

    if (state.stages[stageNum].unlocked) {
      card.classList.remove('locked');
      card.classList.add('unlocked');
      keyGroup.classList.add('hidden');
      playBtn.classList.remove('hidden');
    }

    if (state.stages[stageNum].completed) {
      completedCount++;
      card.classList.add('completed');
      playBtn.classList.add('hidden');
      badge.classList.remove('hidden');
    }
  });

  const fill = document.getElementById('overall-progress');
  const text = document.getElementById('progress-text');
  fill.style.width = `${(completedCount / 3) * 100}%`;
  text.textContent = `${completedCount} / 3 Stages Complete`;
  updateAllScoreDisplays();
}

// ==========================================
// STAGE UNLOCK
// ==========================================

async function tryUnlockStage(stageNum) {
  const input = document.querySelector(`.key-input[data-stage="${stageNum}"]`);
  const key = input.value.trim();
  
  const userHash = await hashAnswer(key);
  const correctHash = STAGE_KEYS[stageNum];

  if (userHash === correctHash) {
    state.stages[stageNum].unlocked = true;
    saveGameState();
    playUnlockSound();
    showToast(`Stage ${stageNum} Unlocked!`, 'success');

    const card = document.querySelector(`.stage-card[data-stage="${stageNum}"]`);
    card.classList.add('just-unlocked');
    setTimeout(() => card.classList.remove('just-unlocked'), 600);

    updateMapUI();
  } else {
    playWrongSound();
    showToast('Incorrect key. Try again!', 'error');
    input.value = '';
    input.focus();
  }
}
// ==========================================
// STAGE 1: DYNAMIC GRID GENERATION
// ==========================================

function generateGrid(words, size) {
  const maxAttempts = 200;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const grid = Array.from({ length: size }, () => Array(size).fill(null));
    const placedWords = [];
    let allPlaced = true;

    const shuffledWords = [...words].sort(() => Math.random() - 0.5);

    for (const word of shuffledWords) {
      let placed = false;
      const shuffledDirs = [...DIRECTIONS].sort(() => Math.random() - 0.5);
      const positions = [];
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          positions.push([r, c]);
        }
      }
      positions.sort(() => Math.random() - 0.5);

      for (const dir of shuffledDirs) {
        if (placed) break;
        for (const [startR, startC] of positions) {
          if (placed) break;
          const cells = [];
          let fits = true;
          for (let i = 0; i < word.length; i++) {
            const r = startR + dir.dr * i;
            const c = startC + dir.dc * i;
            if (r < 0 || r >= size || c < 0 || c >= size) { fits = false; break; }
            if (grid[r][c] !== null && grid[r][c] !== word[i]) { fits = false; break; }
            cells.push([r, c]);
          }
          if (fits) {
            for (let i = 0; i < word.length; i++) {
              grid[cells[i][0]][cells[i][1]] = word[i];
            }
            placedWords.push({ word, cells });
            placed = true;
          }
        }
      }
      if (!placed) {
        allPlaced = false;
        break;
      }
    }

    if (allPlaced) {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (grid[r][c] === null) {
            grid[r][c] = FILLER_LETTERS[Math.floor(Math.random() * FILLER_LETTERS.length)];
          }
        }
      }
      return { letters: grid, words: placedWords };
    }
  }

  // Fallback: simple horizontal placement
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => FILLER_LETTERS[Math.floor(Math.random() * FILLER_LETTERS.length)])
  );
  const placedWords = [];
  let row = 0;
  for (const word of words) {
    if (row >= size) break;
    const cells = [];
    for (let i = 0; i < word.length && i < size; i++) {
      grid[row][i] = word[i];
      cells.push([row, i]);
    }
    placedWords.push({ word, cells });
    row++;
  }
  return { letters: grid, words: placedWords };
}

// ==========================================
// STAGE 1: TIMER
// ==========================================

function startStage1Timer() {
  stopStage1Timer();
  state.stage1.timerValue = STAGE1_TIME_LIMIT;
  state.stage1.timerExpired = false;
  updateTimerDisplay();
  showTimerOverlay(false);

  state.stage1.timerInterval = setInterval(() => {
    state.stage1.timerValue--;
    updateTimerDisplay();

    if (state.stage1.timerValue <= 3 && state.stage1.timerValue > 0) {
      playTimerTickSound();
    }

    if (state.stage1.timerValue <= 0) {
      stopStage1Timer();
      state.stage1.timerExpired = true;
      playTimeUpSound();
      showTimerOverlay(true);
    }
  }, 1000);
}

function stopStage1Timer() {
  if (state.stage1.timerInterval) {
    clearInterval(state.stage1.timerInterval);
    state.stage1.timerInterval = null;
  }
}

function updateTimerDisplay() {
  const el = document.getElementById('stage1-timer');
  if (el) {
    el.textContent = state.stage1.timerValue;
    el.classList.toggle('timer-warning', state.stage1.timerValue <= 3);
  }
}

function showTimerOverlay(show) {
  const overlay = document.getElementById('stage1-time-overlay');
  if (overlay) {
    if (show) {
      overlay.classList.remove('hidden');
    } else {
      overlay.classList.add('hidden');
    }
  }
}

// ==========================================
// STAGE 1: WORD GRID GAME
// ==========================================

let gridCells = [];

function getStage1Score() {
  const attempts = state.stage1.attempts;
  const tierIndex = Math.min(attempts, STAGE1_SCORE_TIERS.length - 1);
  return STAGE1_SCORE_TIERS[tierIndex];
}

function initStage1() {
  state.stage1.grid = generateGrid(STAGE1_WORDS, GRID_SIZE);
  state.stage1.foundWords = [];
  state.stage1.selectedCells = [];
  state.stage1.isSelecting = false;
  state.stage1.timerExpired = false;

  renderStage1Grid();
  startStage1Timer();
}

function retryStage1() {
  state.stage1.attempts++;
  initStage1();
  showToast(`Attempt ${state.stage1.attempts + 1} - Go!`, 'info');
}

function renderStage1Grid() {
  const grid = document.getElementById('word-grid');
  const bank = document.getElementById('word-bank');
  grid.innerHTML = '';
  bank.innerHTML = '';
  gridCells = [];

  const gridData = state.stage1.grid;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.textContent = gridData.letters[r][c];

      if (isCellInFoundWord(r, c)) {
        cell.classList.add('found');
      }

      grid.appendChild(cell);
      gridCells.push(cell);
    }
  }

  STAGE1_WORDS.forEach(word => {
    const hint = document.createElement('span');
    hint.className = 'word-hint';
    hint.textContent = word;
    hint.dataset.word = word;
    if (state.stage1.foundWords.includes(word)) {
      hint.classList.add('found');
    }
    bank.appendChild(hint);
  });

  updateStage1Progress();
  setupGridInteraction();
}

function isCellInFoundWord(r, c) {
  if (!state.stage1.grid) return false;
  return state.stage1.grid.words.some(w =>
    state.stage1.foundWords.includes(w.word) &&
    w.cells.some(([cr, cc]) => cr === r && cc === c)
  );
}

function updateStage1Progress() {
  const el = document.getElementById('stage1-progress');
  el.textContent = `${state.stage1.foundWords.length} / ${STAGE1_WORDS.length}`;
}

function setupGridInteraction() {
  const grid = document.getElementById('word-grid');
  const canvas = document.getElementById('grid-canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const rect = grid.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function getCellFromPoint(x, y) {
    const rect = grid.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;
    const cellSize = rect.width / GRID_SIZE;
    const col = Math.floor(relX / cellSize);
    const row = Math.floor(relY / cellSize);
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      return { row, col };
    }
    return null;
  }

  function isAdjacent(cell1, cell2) {
    const dr = Math.abs(cell1.row - cell2.row);
    const dc = Math.abs(cell1.col - cell2.col);
    return dr <= 1 && dc <= 1 && (dr + dc > 0);
  }

  function drawSelectionLine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const selected = state.stage1.selectedCells;
    if (selected.length < 2) return;

    const cellSize = canvas.width / GRID_SIZE;

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(212, 163, 62, 0.6)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    selected.forEach((cell, i) => {
      const x = cell.col * cellSize + cellSize / 2;
      const y = cell.row * cellSize + cellSize / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  }

  function startSelection(x, y) {
    if (state.stage1.timerExpired) return;
    const cell = getCellFromPoint(x, y);
    if (!cell) return;
    state.stage1.isSelecting = true;
    state.stage1.selectedCells = [cell];
    highlightCells();
    playSelectSound();
  }

  function moveSelection(x, y) {
    if (!state.stage1.isSelecting || state.stage1.timerExpired) return;
    const cell = getCellFromPoint(x, y);
    if (!cell) return;

    const selected = state.stage1.selectedCells;
    const last = selected[selected.length - 1];

    if (selected.some(s => s.row === cell.row && s.col === cell.col)) return;

    if (isAdjacent(last, cell)) {
      selected.push(cell);
      highlightCells();
      drawSelectionLine();
      playSelectSound();
    }
  }

  function endSelection() {
    if (!state.stage1.isSelecting) return;
    state.stage1.isSelecting = false;

    if (state.stage1.timerExpired) {
      state.stage1.selectedCells = [];
      clearHighlights();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const selected = state.stage1.selectedCells;
    const gridData = state.stage1.grid;
    const word = selected.map(c => gridData.letters[c.row][c.col]).join('');

    const match = gridData.words.find(w => {
      if (w.word !== word) return false;
      if (w.cells.length !== selected.length) return false;
      return w.cells.every(([r, c], i) => selected[i].row === r && selected[i].col === c);
    });

    if (match && !state.stage1.foundWords.includes(match.word)) {
      state.stage1.foundWords.push(match.word);
      playCorrectSound();
      showToast(`Found: ${match.word}!`, 'success');
      markFoundWord(match);
      updateStage1Progress();

      if (state.stage1.foundWords.length === STAGE1_WORDS.length) {
        stopStage1Timer();
        if (!state.stage1.scored) {
          state.stage1.scored = true;
          const pts = getStage1Score();
          addScore(pts);
          showToast(`Stage 1 complete! +${pts} pts`, 'success', 3000);
        }
        setTimeout(() => completeStage(1), 600);
      }
    } else if (word.length > 1) {
      playWrongSound();
      selected.forEach(c => {
        const cellEl = grid.children[c.row * GRID_SIZE + c.col];
        cellEl.classList.add('wrong');
        setTimeout(() => cellEl.classList.remove('wrong'), 400);
      });
    }

    state.stage1.selectedCells = [];
    clearHighlights();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function highlightCells() {
    clearHighlights();
    state.stage1.selectedCells.forEach(c => {
      const cellEl = grid.children[c.row * GRID_SIZE + c.col];
      cellEl.classList.add('selecting');
    });
  }

  function clearHighlights() {
    gridCells.forEach(c => c.classList.remove('selecting'));
  }

  function markFoundWord(wordData) {
    wordData.cells.forEach(([r, c]) => {
      const cellEl = grid.children[r * GRID_SIZE + c];
      cellEl.classList.add('found');
    });
    const hint = document.querySelector(`.word-hint[data-word="${wordData.word}"]`);
    if (hint) hint.classList.add('found');
  }

  // Touch events
  grid.addEventListener('touchstart', e => {
    e.preventDefault();
    const touch = e.touches[0];
    startSelection(touch.clientX, touch.clientY);
  }, { passive: false });

  grid.addEventListener('touchmove', e => {
    e.preventDefault();
    const touch = e.touches[0];
    moveSelection(touch.clientX, touch.clientY);
  }, { passive: false });

  grid.addEventListener('touchend', e => {
    e.preventDefault();
    endSelection();
  }, { passive: false });

  // Mouse events
  grid.addEventListener('mousedown', e => {
    startSelection(e.clientX, e.clientY);
  });

  grid.addEventListener('mousemove', e => {
    moveSelection(e.clientX, e.clientY);
  });

  grid.addEventListener('mouseup', () => {
    endSelection();
  });

  grid.addEventListener('mouseleave', () => {
    endSelection();
  });
}

// ==========================================
// STAGE 2: IMAGE CLUES GAME (Multi-Question)
// ==========================================

function isImageSolved(imageIndex) {
  return state.stage2.solvedImages.includes(imageIndex);
}

function isImageQuestionSolved(imageIndex, qIndex) {
  const solved = state.stage2.solvedQuestions[imageIndex];
  return solved && solved.includes(qIndex);
}

function areAllImageQuestionsSolved(imageIndex) {
  const clue = IMAGE_CLUES[imageIndex];
  const solved = state.stage2.solvedQuestions[imageIndex] || [];
  return solved.length === clue.questions.length;
}

function getTotalStage2Questions() {
  return IMAGE_CLUES.reduce((sum, clue) => sum + clue.questions.length, 0);
}

function getTotalSolvedStage2Questions() {
  let count = 0;
  for (const key in state.stage2.solvedQuestions) {
    count += state.stage2.solvedQuestions[key].length;
  }
  return count;
}

function useStage2Hint(imageIndex) {
  if (state.stage2.hintUsed[imageIndex]) return;
  if (isImageSolved(imageIndex)) return;

  const confirmed = confirm('Using a hint will reduce your score by ' + HINT_COST + ' points for this image. Do you want to continue?');
  if (!confirmed) return;

  state.stage2.hintUsed[imageIndex] = true;
  addScore(-HINT_COST);
  playHintSound();

  // Show the hint text
  const hintTextEl = document.querySelector(`.clue-hint-text[data-image="${imageIndex}"]`);
  if (hintTextEl) {
    hintTextEl.classList.remove('hidden');
  }

  showToast(`Hint used! -${HINT_COST} pts`, 'info');

  // Disable hint button
  const hintBtn = document.querySelector(`.btn-hint-s2[data-image="${imageIndex}"]`);
  if (hintBtn) {
    hintBtn.disabled = true;
    hintBtn.classList.add('used');
  }
}

function initStage2() {
  const container = document.getElementById('image-clues');
  container.innerHTML = '';

  IMAGE_CLUES.forEach((clue, imageIndex) => {
    const card = document.createElement('div');
    card.className = 'clue-card clue-card-full';
    card.dataset.image = imageIndex;
    if (isImageSolved(imageIndex)) {
      card.classList.add('solved');
    }

    // Image
    const img = document.createElement('img');
    img.className = 'clue-image';
    img.src = clue.image;
    img.alt = 'Event image clue';
    card.appendChild(img);

    // Description
    const descEl = document.createElement('p');
    descEl.className = 'clue-description';
    descEl.textContent = clue.description;
    card.appendChild(descEl);

    // Questions container
    const questionsContainer = document.createElement('div');
    questionsContainer.className = 'clue-questions';

    clue.questions.forEach((q, qIndex) => {
      const qBlock = document.createElement('div');
      qBlock.className = 'clue-question-block';
      qBlock.dataset.image = imageIndex;
      qBlock.dataset.question = qIndex;

      const qLabel = document.createElement('p');
      qLabel.className = 'clue-question';
      qLabel.textContent = `Q${qIndex + 1}: ${q.question}`;
      qBlock.appendChild(qLabel);

      // Input field for the answer (supports multi-word)
      const inputWrapper = document.createElement('div');
      inputWrapper.className = 'clue-input-wrapper';

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'clue-input';
      input.placeholder = 'Type your answer...';
      input.maxLength = 50;
      input.dataset.image = imageIndex;
      input.dataset.question = qIndex;
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('autocapitalize', 'characters');

      if (isImageQuestionSolved(imageIndex, qIndex)) {
        input.value = q.answer;
        input.classList.add('correct');
        input.disabled = true;
      }

      // Submit on Enter
      input.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
        await  validateStage2Question(imageIndex, qIndex, input, qBlock, card);
        }
      });

      // Highlight card on focus
      input.addEventListener('focus', () => {
        document.querySelectorAll('.clue-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });

      input.addEventListener('blur', () => {
        card.classList.remove('active');
      });

      const submitBtn = document.createElement('button');
      submitBtn.className = 'btn-submit-flag';
      submitBtn.textContent = 'Check';
      if (isImageQuestionSolved(imageIndex, qIndex)) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
      }
      submitBtn.addEventListener('click', async () => {
  await validateStage2Question(imageIndex, qIndex, input, qBlock, card);
      });

      inputWrapper.appendChild(input);
      inputWrapper.appendChild(submitBtn);
      qBlock.appendChild(inputWrapper);

      // Solved indicator per question
      const qSolvedBadge = document.createElement('span');
      qSolvedBadge.className = 'q-solved-badge';
      qSolvedBadge.textContent = 'Correct';
      if (!isImageQuestionSolved(imageIndex, qIndex)) {
        qSolvedBadge.classList.add('hidden');
      }
      qBlock.appendChild(qSolvedBadge);

      questionsContainer.appendChild(qBlock);
    });

    card.appendChild(questionsContainer);

    // Hint text (hidden by default, shared for the entire image)
    const hintTextEl = document.createElement('p');
    hintTextEl.className = 'clue-hint-text hidden';
    hintTextEl.dataset.image = imageIndex;
    hintTextEl.textContent = clue.hint;
    if (state.stage2.hintUsed[imageIndex]) {
      hintTextEl.classList.remove('hidden');
    }
    card.appendChild(hintTextEl);

    // Hint button (shared for the entire image)
    const hintBtn = document.createElement('button');
    hintBtn.className = 'btn-hint btn-hint-s2';
    hintBtn.dataset.image = imageIndex;
    hintBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 12 18.469a3.374 3.374 0 0 0-1.487-2.12z"/></svg><span>Hint (-' + HINT_COST + ' pts)</span>';

    if (isImageSolved(imageIndex) || state.stage2.hintUsed[imageIndex]) {
      hintBtn.disabled = true;
      hintBtn.classList.add('used');
    }

    hintBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      useStage2Hint(imageIndex);
    });
    card.appendChild(hintBtn);

    // Solved badge for the whole image
    const solvedBadge = document.createElement('div');
    solvedBadge.className = 'clue-solved-badge';
    solvedBadge.dataset.image = imageIndex;
    solvedBadge.textContent = 'completed';
    if (!isImageSolved(imageIndex)) {
      solvedBadge.classList.add('hidden');
    }
    card.appendChild(solvedBadge);

    container.appendChild(card);
  });

  updateStage2Progress();
}
function normalizeText(text) {
  return text
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')        // حذف جميع المسافات
    .replace(/[^A-Z0-9]/g, ''); // حذف أي رموز (مثل @, !, ., وغيرها)
}
// دالة لحساب SHA-256 لأي نص
async function hashAnswer(answer) {
  // 1. تنظيف النص لضمان تطابق الهاش حتى لو أدخل المستخدم مسافات أو رموز
  const cleanText = normalizeText(answer);
  
  // 2. عملية التشفير (Hashing)
  const encoder = new TextEncoder();
  const data = encoder.encode(cleanText);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  
  // 3. تحويل النتيجة إلى نص Hex
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
async function validateStage2Question(imageIndex, qIndex, input, qBlock, card) {
  if (isImageQuestionSolved(imageIndex, qIndex)) return;

  const clue = IMAGE_CLUES[imageIndex];
  const q = clue.questions[qIndex];
  
  const userAnswer = input.value.trim();
  if (userAnswer.length === 0) return;

  const userHash = await hashAnswer(userAnswer);
  const correctHash = q.answer; // هنا الهاش مخزن في حقل answer

  if (userHash === correctHash) {
    if (!state.stage2.solvedQuestions[imageIndex]) {
      state.stage2.solvedQuestions[imageIndex] = [];
    }
    state.stage2.solvedQuestions[imageIndex].push(qIndex);

    input.classList.add('correct');
    input.disabled = true;

    const submitBtn = qBlock.querySelector('.btn-submit-flag');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.5';
    }

    const qBadge = qBlock.querySelector('.q-solved-badge');
    if (qBadge) qBadge.classList.remove('hidden');

    playCorrectSound();
    showToast(`Correct!`, 'success');

    if (areAllImageQuestionsSolved(imageIndex) && !isImageSolved(imageIndex)) {
      state.stage2.solvedImages.push(imageIndex);
      addScore(STAGE2_BASE_POINTS);
      card.classList.add('solved');
      const imgBadge = card.querySelector('.clue-solved-badge');
      if (imgBadge) imgBadge.classList.remove('hidden');
      showToast(`Mission complete!`, 'success', 3000);
    }

    updateStage2Progress();
    if (state.stage2.solvedImages.length === IMAGE_CLUES.length) {
      setTimeout(() => completeStage(2), 600);
    }
    saveGameState();
  } else {
    playWrongSound();
    input.classList.add('wrong');
    setTimeout(() => input.classList.remove('wrong'), 400);
    showToast('Not quite, try again!', 'error');
  }
}

// ==========================================
// STAGE 3: FLAG DISCOVERY GAME (Multi-Question)
// ==========================================

function isScenarioSolved(scenarioIndex) {
  return state.stage3.solvedScenarios.includes(scenarioIndex);
}

function isScenarioQuestionSolved(scenarioIndex, qIndex) {
  const solved = state.stage3.solvedQuestions[scenarioIndex];
  return solved && solved.includes(qIndex);
}

function areAllScenarioQuestionsSolved(scenarioIndex) {
  const scenario = SCENARIOS[scenarioIndex];
  const solved = state.stage3.solvedQuestions[scenarioIndex] || [];
  return solved.length === scenario.questions.length;
}

function useStage3Hint(scenarioIndex) {
  if (state.stage3.hintUsed[scenarioIndex]) return;
  if (isScenarioSolved(scenarioIndex)) return;

  const confirmed = confirm('Using a hint will reduce your score by ' + HINT_COST + ' points for this scenario. Do you want to continue?');
  if (!confirmed) return;

  state.stage3.hintUsed[scenarioIndex] = true;
  addScore(-HINT_COST);
  playHintSound();

  const hintEl = document.querySelector(`.scenario-hint-text[data-scenario="${scenarioIndex}"]`);
  if (hintEl) {
    hintEl.classList.remove('hidden');
  }

  showToast(`Hint used! -${HINT_COST} pts`, 'info');

  const hintBtn = document.querySelector(`.btn-hint-s3[data-scenario="${scenarioIndex}"]`);
  if (hintBtn) {
    hintBtn.disabled = true;
    hintBtn.classList.add('used');
  }
}

function initStage3() {
  const container = document.getElementById('scenarios');
  container.innerHTML = '';

  SCENARIOS.forEach((scenario, scenarioIndex) => {
    const card = document.createElement('div');
    card.className = 'scenario-card';
    if (isScenarioSolved(scenarioIndex)) {
      card.classList.add('solved');
    }

    // Header
    const header = document.createElement('div');
    header.className = 'scenario-header';

    const title = document.createElement('h4');
    title.textContent = `${scenarioIndex + 1}. ${scenario.title}`;

    const solvedCount = (state.stage3.solvedQuestions[scenarioIndex] || []).length;
    const totalCount = scenario.questions.length;

    const badge = document.createElement('span');
    if (isScenarioSolved(scenarioIndex)) {
      badge.className = 'scenario-badge solved';
      badge.textContent = 'Captured';
    } else {
      badge.className = 'scenario-badge open';
      badge.textContent = `${solvedCount}/${totalCount}`;
    }

    header.appendChild(title);
    header.appendChild(badge);

    // Body
    const body = document.createElement('div');
    body.className = 'scenario-body';

    const media = document.createElement('div');
    media.className = 'scenario-media';
    const img = document.createElement('img');
    img.src = scenario.image;
    img.alt = scenario.title;
    media.appendChild(img);

    const desc = document.createElement('p');
    desc.className = 'scenario-desc';
    desc.innerHTML = scenario.description;

    // Hint text (hidden by default, shared for the entire scenario)
    const hintTextEl = document.createElement('p');
    hintTextEl.className = 'scenario-hint-text hidden';
    hintTextEl.dataset.scenario = scenarioIndex;
    hintTextEl.textContent = scenario.hintText;
    if (state.stage3.hintUsed[scenarioIndex]) {
      hintTextEl.classList.remove('hidden');
    }

    // Hint button (shared for the entire scenario)
    const hintBtn = document.createElement('button');
    hintBtn.className = 'btn-hint btn-hint-s3';
    hintBtn.dataset.scenario = scenarioIndex;
    hintBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 12 18.469a3.374 3.374 0 0 0-1.487-2.12z"/></svg><span>Hint (-' + HINT_COST + ' pts)</span>';

    if (isScenarioSolved(scenarioIndex) || state.stage3.hintUsed[scenarioIndex]) {
      hintBtn.disabled = true;
      hintBtn.classList.add('used');
    }

    hintBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      useStage3Hint(scenarioIndex);
    });

    body.appendChild(media);
    body.appendChild(desc);
    body.appendChild(hintTextEl);
    body.appendChild(hintBtn);

    // Questions container
    const questionsContainer = document.createElement('div');
    questionsContainer.className = 'scenario-questions';

    scenario.questions.forEach((q, qIndex) => {
      const qBlock = document.createElement('div');
      qBlock.className = 'scenario-question-block';
      qBlock.dataset.scenario = scenarioIndex;
      qBlock.dataset.question = qIndex;

      const qLabel = document.createElement('p');
      qLabel.className = 'scenario-question-label';
      qLabel.textContent = `Q${qIndex + 1}: ${q.question}`;
      qBlock.appendChild(qLabel);

      const inputGroup = document.createElement('div');
      inputGroup.className = 'flag-input-group';

      const flagInput = document.createElement('input');
      flagInput.type = 'text';
      flagInput.className = 'flag-input';
      flagInput.placeholder = 'Enter flag...';
      flagInput.maxLength = 30;
      flagInput.dataset.scenario = scenarioIndex;
      flagInput.dataset.question = qIndex;

      if (isScenarioQuestionSolved(scenarioIndex, qIndex)) {
        flagInput.value = q.flag;
        flagInput.classList.add('correct');
        flagInput.disabled = true;
      }

      const submitBtn = document.createElement('button');
      submitBtn.className = 'btn-submit-flag';
      submitBtn.textContent = 'Submit';
      if (isScenarioQuestionSolved(scenarioIndex, qIndex)) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
      }

      submitBtn.addEventListener('click', () => {
        validateStage3Question(scenarioIndex, qIndex, flagInput, badge, card, qBlock);
      });

      flagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          validateStage3Question(scenarioIndex, qIndex, flagInput, badge, card, qBlock);
        }
      });

      inputGroup.appendChild(flagInput);
      inputGroup.appendChild(submitBtn);
      qBlock.appendChild(inputGroup);

      // Per-question solved badge
      const qSolvedBadge = document.createElement('span');
      qSolvedBadge.className = 'q-solved-badge';
      qSolvedBadge.textContent = 'Captured';
      if (!isScenarioQuestionSolved(scenarioIndex, qIndex)) {
        qSolvedBadge.classList.add('hidden');
      }
      qBlock.appendChild(qSolvedBadge);

      questionsContainer.appendChild(qBlock);
    });

    body.appendChild(questionsContainer);

    // Toggle body on header click
    header.addEventListener('click', () => {
      const isOpen = body.classList.contains('open');
      document.querySelectorAll('.scenario-body').forEach(b => b.classList.remove('open'));
      if (!isOpen) body.classList.add('open');
    });

    card.appendChild(header);
    card.appendChild(body);
    container.appendChild(card);
  });

  updateStage3Progress();
}

async function validateStage3Question(scenarioIndex, qIndex, input, badge, card, qBlock) {
  if (isScenarioQuestionSolved(scenarioIndex, qIndex)) return;

  const userAnswer = input.value.trim();
  if (userAnswer.length === 0) return;

  const userHash = await hashAnswer(userAnswer);
  const correctHash = SCENARIOS[scenarioIndex].questions[qIndex].flag; // الهاش مخزن في flag

  if (userHash === correctHash) {
    if (!state.stage3.solvedQuestions[scenarioIndex]) {
      state.stage3.solvedQuestions[scenarioIndex] = [];
    }
    state.stage3.solvedQuestions[scenarioIndex].push(qIndex);

    input.classList.add('correct');
    input.disabled = true;

    const submitBtn = qBlock.querySelector('.btn-submit-flag');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.5';
    }

    const qBadge = qBlock.querySelector('.q-solved-badge');
    if (qBadge) qBadge.classList.remove('hidden');

    playCorrectSound();
    showToast(`Flag captured!`, 'success');

    if (areAllScenarioQuestionsSolved(scenarioIndex) && !isScenarioSolved(scenarioIndex)) {
      state.stage3.solvedScenarios.push(scenarioIndex);
      addScore(STAGE3_BASE_POINTS);
      card.classList.add('solved');
      showToast(`Scenario complete!`, 'success', 3000);
    }

    updateStage3Progress();
    if (state.stage3.solvedScenarios.length === SCENARIOS.length) {
      setTimeout(() => completeStage(3), 600);
    }
    saveGameState();
  } else {
    playWrongSound();
    input.classList.add('wrong');
    setTimeout(() => input.classList.remove('wrong'), 400);
    showToast('Wrong flag. Investigate further!', 'error');
    if (state.stage2.solvedImages.length === IMAGE_CLUES.length) {
      setTimeout(() => completeStage(2), 600);
    }
   else {
    playWrongSound();
    input.classList.add('wrong');
    setTimeout(() => input.classList.remove('wrong'), 400);
    showToast('Not quite, try again!', 'error');
  }
     // Check if all scenarios are solved
    if (state.stage3.solvedScenarios.length === SCENARIOS.length) {
      setTimeout(() => completeStage(3), 600);
    }
   else {
    playWrongSound();
    input.classList.add('wrong');
    setTimeout(() => input.classList.remove('wrong'), 400);
    showToast('Wrong flag. Investigate further!', 'error');
  }
}
}
function updateStage3Progress() {
  const el = document.getElementById('stage3-progress');
  el.textContent = `${state.stage3.solvedScenarios.length} / ${SCENARIOS.length}`;
}
function updateStage2Progress() {
  const el = document.getElementById('stage2-progress');
  el.textContent = `${state.stage2.solvedImages.length} / ${IMAGE_CLUES.length}`;
  }


function updateStage2Progress() {
  const el = document.getElementById('stage2-progress');
  el.textContent = `${state.stage2.solvedImages.length} / ${IMAGE_CLUES.length}`;
}
// ==========================================
// STAGE COMPLETION
// ==========================================

function completeStage(stageNum) {
  state.stages[stageNum].completed = true;
  saveGameState(); // SAVE PROGRESS
  fireConfetti();
  playCompletionSound();
  showToast(`Stage ${stageNum} Complete!`, 'success', 3000);

  const allComplete = Object.values(state.stages).every(s => s.completed);
  if (allComplete) {
    setTimeout(() => {
      showScreen('end-screen');
      const finalScoreEl = document.getElementById('final-score');
      if (finalScoreEl) finalScoreEl.textContent = state.totalScore;
      fireConfetti();
    }, 2000);
  } else {
    setTimeout(() => {
      showScreen('map-screen');
      updateMapUI();
    }, 2000);
  }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  loadGameState(); // LOAD PROGRESS ON START
  updateAllScoreDisplays();
  updateMapUI();
  // Start button
  document.getElementById('start-btn').addEventListener('click', () => {
    showScreen('map-screen');
    startBgMusic();
    updateMapUI();
  });

  // Back buttons
  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      showScreen(target);
      if (target === 'map-screen') updateMapUI();
    });
  });

  // Unlock buttons
  document.querySelectorAll('.btn-unlock').forEach(btn => {
    btn.addEventListener('click', () => {
      const stageNum = parseInt(btn.dataset.stage);
      tryUnlockStage(stageNum);
    });
  });

  // Key input Enter key
  document.querySelectorAll('.key-input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const stageNum = parseInt(input.dataset.stage);
        tryUnlockStage(stageNum);
      }
    });
  });

  // Play buttons
  document.querySelectorAll('.btn-play').forEach(btn => {
    btn.addEventListener('click', () => {
      const stageNum = parseInt(btn.dataset.stage);
      showScreen(`stage${stageNum}-screen`);
      if (stageNum === 1) initStage1();
      else if (stageNum === 2) initStage2();
      else if (stageNum === 3) initStage3();
    });
  });

  // Stage 1 retry button
  document.getElementById('stage1-retry-btn').addEventListener('click', () => {
    retryStage1();
  });

  // Mute button
  document.getElementById('mute-btn').addEventListener('click', () => {
    state.muted = !state.muted;
    const btn = document.getElementById('mute-btn');
    btn.querySelector('.sound-on').classList.toggle('hidden', state.muted);
    btn.querySelector('.sound-off').classList.toggle('hidden', !state.muted);

    if (state.muted) {
      stopBgMusic();
    } else {
      startBgMusic();
    }
  });

  // Replay button
  document.getElementById('replay-btn').addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY); // CLEAR STORAGE
    state.totalScore = 0;
    state.stages = {
      1: { unlocked: false, completed: false },
      2: { unlocked: false, completed: false },
      3: { unlocked: false, completed: false }
    };
    state.stage1 = {
      foundWords: [],
      selectedCells: [],
      isSelecting: false,
      attempts: 0,
      scored: false,
      grid: null,
      timerValue: STAGE1_TIME_LIMIT,
      timerInterval: null,
      timerExpired: false
    };
    state.stage2 = { solvedQuestions: {}, solvedImages: [], hintUsed: {} };
    state.stage3 = { solvedQuestions: {}, solvedScenarios: [], hintUsed: {} };

    // Reset UI
    document.querySelectorAll('.stage-card').forEach(card => {
      card.classList.remove('unlocked', 'completed', 'just-unlocked');
      card.classList.add('locked');
      card.querySelector('.key-input-group').classList.remove('hidden');
      card.querySelector('.btn-play').classList.add('hidden');
      card.querySelector('.stage-complete-badge').classList.add('hidden');
      const input = card.querySelector('.key-input');
      if (input) input.value = '';
    });

    updateAllScoreDisplays();
    showScreen('home-screen');
  });

  // Handle window resize for confetti
  window.addEventListener('resize', resizeConfettiCanvas);

  // Initialize score displays
  updateAllScoreDisplays();
});
