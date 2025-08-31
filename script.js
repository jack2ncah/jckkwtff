// ==============================
// Landing Overlay + Main Content
// ==============================
const enterBtn = document.getElementById("enter-btn");
const landing = document.getElementById("landing");
const mainContent = document.getElementById("main-content");
const audioControlCenter = document.querySelector(".volume-control");

// Hide main content and audio center initially
mainContent.style.display = "none";
audioControlCenter.style.display = "none";

let audioController;

// Initialize AudioController after DOM loaded
document.addEventListener("DOMContentLoaded", () => {
    audioController = new AudioController();
    audioController.audioElement.pause(); // Ensure music doesn't autoplay
});

// Click to enter
enterBtn.addEventListener("click", () => {
    // Fade out landing overlay
    landing.style.opacity = "0";
    setTimeout(() => {
        landing.style.display = "none";
        mainContent.style.display = "block";
        audioControlCenter.style.display = "flex"; // Show audio control center

        // Play music through AudioController
        audioController.audioElement.play()
            .then(() => {
                audioController.isPlaying = true;
                audioController.updateDisplay();
            })
            .catch(err => console.warn("Autoplay blocked:", err));
    }, 300); // Match fade duration
});
const profileTitle = document.getElementById('profileTitle');
// ==============================
// Animated Browser Tab Title
// ==============================
const tabTitles = ["BioLink Jckk", "Content Creator", "Gamer", "Streamer"];
let tabIndex = 0;
let tabCharIndex = 0;
let tabTypingForward = true;

function animateTabTitle() {
    const current = tabTitles[tabIndex];
    if (tabTypingForward) {
        tabCharIndex++;
        document.title = current.substring(0, tabCharIndex);
        if (tabCharIndex === current.length) {
            tabTypingForward = false;
            setTimeout(animateTabTitle, 1000);
            return;
        }
    } else {
        tabCharIndex--;
        document.title = current.substring(0, tabCharIndex);
        if (tabCharIndex === 0) {
            tabTypingForward = true;
            tabIndex = (tabIndex + 1) % tabTitles.length;
        }
    }
    setTimeout(animateTabTitle, tabTypingForward ? 270 : 250);
}
animateTabTitle();

// ==============================
// Audio Control Center
// ==============================
class AudioController {
    constructor() {
        this.isPlaying = false;
        this.volume = 35;
        this.isMuted = false;

        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        this.audioElement = document.getElementById('audioElement');

        // Buttons
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.muteBtn = document.getElementById('muteBtn');

        // Icons
        this.playIcon = document.getElementById('playIcon');
        this.pauseIcon = document.getElementById('pauseIcon');
        this.volumeIcon = document.getElementById('volumeIcon');
        this.muteIcon = document.getElementById('muteIcon');

        // Slider & text
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeText = document.getElementById('volumeText');

        // Status
        this.statusText = document.getElementById('statusText');
        this.trackText = document.getElementById('trackText');
        this.glowEffect = document.getElementById('glowEffect');

        // Volume indicators
        this.indicators = document.querySelectorAll('.indicator');

        // Initial audio volume
        this.audioElement.volume = this.volume / 100;
    }

    bindEvents() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('input', (e) => this.handleVolumeChange(e.target.value));

        this.audioElement.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updateDisplay();
        });

        this.audioElement.addEventListener('play', () => {
            this.isPlaying = true;
            this.updateDisplay();
        });

        this.audioElement.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updateDisplay();
        });
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.audioElement.pause();
        } else {
            this.audioElement.play().catch(err => {
                console.error('Error playing audio:', err);
                this.isPlaying = false;
                this.updateDisplay();
            });
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.audioElement.volume = this.isMuted ? 0 : this.volume / 100;
        this.updateDisplay();
    }

    handleVolumeChange(newVolume) {
        this.volume = parseInt(newVolume);
        if (this.volume > 0 && this.isMuted) this.isMuted = false;
        this.audioElement.volume = this.isMuted ? 0 : this.volume / 100;
        this.updateDisplay();
    }

    updateDisplay() {
        // Play/Pause icons
        if (this.isPlaying) {
            this.playIcon.classList.add('hidden');
            this.pauseIcon.classList.remove('hidden');
            this.playPauseBtn.classList.add('playing');
            this.glowEffect.classList.remove('hidden');
        } else {
            this.playIcon.classList.remove('hidden');
            this.pauseIcon.classList.add('hidden');
            this.playPauseBtn.classList.remove('playing');
            this.glowEffect.classList.add('hidden');
        }

        // Mute icon
        if (this.isMuted || this.volume === 0) {
            this.volumeIcon.classList.add('hidden');
            this.muteIcon.classList.remove('hidden');
        } else {
            this.volumeIcon.classList.remove('hidden');
            this.muteIcon.classList.add('hidden');
        }

        // Volume text & slider
        this.volumeText.textContent = `${this.isMuted ? 0 : this.volume}%`;
        this.volumeSlider.value = this.volume;

        // Volume indicators
        const activeLevel = Math.floor((this.isMuted ? 0 : this.volume) / 10);
        this.indicators.forEach((indicator, i) => {
            if (i < activeLevel) indicator.classList.add('active');
            else indicator.classList.remove('active');
        });

        // Status text
        this.statusText.textContent = this.isPlaying ? 'Now Playing' : 'Paused';
        if (this.isPlaying) this.trackText.classList.add('playing');
        else this.trackText.classList.remove('playing');

        this.updateSliderBackground();
    }

    updateSliderBackground() {
        const percentage = this.isMuted ? 0 : this.volume;
        const gradient = `linear-gradient(to right,
            hsla(234, 70%, 65%, 1.00) 0%,
            hsla(268, 65%, 60%, 1.00) ${percentage}%,
            hsla(240, 14%, 10%, 1.00) ${percentage}%,
            hsla(206, 14%, 10%, 1.00) 100%)`;
        this.volumeSlider.style.background = gradient;
    }
}
// ==============================
// Progress Bar Audio
// ==============================
const audio = document.getElementById("audioElement");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

// Update progress bar as audio plays
audio.addEventListener("timeupdate", () => {
  if (!isNaN(audio.duration)) {
    progressBar.max = Math.floor(audio.duration);
    progressBar.value = Math.floor(audio.currentTime);

    // Format times
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

// Seek when user drags progress bar
progressBar.addEventListener("input", () => {
  audio.currentTime = progressBar.value;
});

// Helper: format time mm:ss
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// ==================================
// SnowFlakes Falling Overlay Script
// ==================================
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let snowflakes = [];

// Create snowflakes
function createSnowflakes() {
    const numFlakes = 600; // total snowflakes
    for (let i = 0; i < numFlakes; i++) {
        snowflakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 4 + 1, // size
            d: Math.random() * 0.2 + 0.5 // speed factor
        });
    }
}

// Draw snowflakes as tiny star-like shapes
function drawSnowflakes() {
    ctx.clearRect(0, 0, width, height);

    for (let flake of snowflakes) {
        ctx.strokeStyle = `rgba(255,255,255,0.3)`; // transparency 0.3
        ctx.lineWidth = 1;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            ctx.moveTo(flake.x, flake.y);
            ctx.lineTo(flake.x + flake.r * Math.cos(angle), flake.y + flake.r * Math.sin(angle));
        }
        ctx.stroke();
    }

    moveSnowflakes();
}

// Animate snowflakes
function moveSnowflakes() {
    for (let flake of snowflakes) {
       flake.y += Math.pow(flake.d, 2) + 1;    // vertical speed
       flake.x += Math.sin(flake.y * 0.01) * 0.1,5; // small horizontal sway

        if (flake.y > height) {
            flake.y = 0;
            flake.x = Math.random() * width;
        }
    }
}

// Animation loop
function animateSnow() {
    drawSnowflakes();
    requestAnimationFrame(animateSnow);
}

// Handle resize
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

// Start
createSnowflakes();
animateSnow();
