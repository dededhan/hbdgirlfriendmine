// State Management
let currentScreen = 'welcome';
let customMessage = '';
let currentPhotoIndex = 0;
let isPlaying = false;

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const envelopeScreen = document.getElementById('envelopeScreen');
const startButton = document.getElementById('startButton');
const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter');
const tapHint = document.getElementById('tapHint');
const letterBody = document.getElementById('letterBody');
const heartsContainer = document.getElementById('heartsContainer');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    setupEventListeners();
    setupGallery();
    setupMusicPlayer();
});

// Event Listeners
function setupEventListeners() {
    startButton.addEventListener('click', showEnvelope);
    envelope.addEventListener('click', openEnvelope);
}

// Screen Transitions
function showEnvelope() {
    welcomeScreen.classList.remove('active');

    setTimeout(() => {
        envelopeScreen.classList.add('active');
        animateEnvelopeEntrance();
    }, 500);
}

function animateEnvelopeEntrance() {
    envelope.style.opacity = '0';
    envelope.style.transform = 'translateY(50px) scale(0.8)';

    setTimeout(() => {
        envelope.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        envelope.style.opacity = '1';
        envelope.style.transform = 'translateY(0) scale(1)';
    }, 100);
}

function openEnvelope() {
    if (envelope.classList.contains('opening')) return;

    envelope.classList.add('opening');
    tapHint.style.opacity = '0';

    // Remove click listener to prevent multiple opens
    envelope.removeEventListener('click', openEnvelope);

    // Wait for envelope flap animation to complete before showing letter
    setTimeout(() => {
        envelope.classList.add('fully-open');
        // Small delay before confetti so letter appears first
        setTimeout(() => {
            createConfetti();
        }, 300);
    }, 2000);
}


// Visual Effects
function createFloatingHearts() {
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝'];

    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heart.style.fontSize = (Math.random() * 10 + 15) + 'px';

        heartsContainer.appendChild(heart);

        // Remove after animation
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }, 800);
}

function createConfetti() {
    const colors = ['#ff6b6b', '#ee5a6f', '#f093fb', '#f5576c', '#fda085', '#f6d365'];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.width = (Math.random() * 8 + 5) + 'px';
            confetti.style.height = (Math.random() * 8 + 5) + 'px';

            // Random shapes
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }

            heartsContainer.appendChild(confetti);

            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 30);
    }
}


// Add fadeOut animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(fadeOutStyle);

// Photo Gallery Functions
function setupGallery() {
    const prevButton = document.getElementById('prevPhoto');
    const nextButton = document.getElementById('nextPhoto');
    const dots = document.querySelectorAll('.dot');

    if (prevButton) {
        prevButton.addEventListener('click', () => navigateGallery(-1));
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => navigateGallery(1));
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            showPhoto(index);
        });
    });

    // Auto-advance gallery every 5 seconds
    setInterval(() => {
        if (envelope.classList.contains('fully-open')) {
            navigateGallery(1);
        }
    }, 5000);
}

function navigateGallery(direction) {
    const polaroids = document.querySelectorAll('.polaroid');
    const totalPhotos = polaroids.length;

    currentPhotoIndex = (currentPhotoIndex + direction + totalPhotos) % totalPhotos;
    showPhoto(currentPhotoIndex);
}

function showPhoto(index) {
    const polaroids = document.querySelectorAll('.polaroid');
    const dots = document.querySelectorAll('.dot');

    polaroids.forEach((polaroid, i) => {
        if (i === index) {
            polaroid.classList.add('active');
        } else {
            polaroid.classList.remove('active');
        }
    });

    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    currentPhotoIndex = index;
}

// Music Player Functions
function setupMusicPlayer() {
    const musicToggle = document.getElementById('musicToggle');

    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
}

let audioContext;
let oscillator;
let gainNode;

function toggleMusic() {
    const musicToggle = document.getElementById('musicToggle');
    const musicText = musicToggle.querySelector('.music-text');

    if (!isPlaying) {
        playBirthdayMusic();
        musicToggle.classList.add('playing');
        musicText.textContent = 'Pause Music';
        isPlaying = true;
    } else {
        stopMusic();
        musicToggle.classList.remove('playing');
        musicText.textContent = 'Play Birthday Music';
        isPlaying = false;
    }
}

function playBirthdayMusic() {
    // Create audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Happy Birthday melody - Complete version with all verses
    const notes = [
        // "Happy birthday to you" (verse 1)
        { freq: 261.63, duration: 0.5 }, // C - Hap-
        { freq: 261.63, duration: 0.5 }, // C - py
        { freq: 293.66, duration: 1 },   // D - birth-
        { freq: 261.63, duration: 1 },   // C - day
        { freq: 349.23, duration: 1 },   // F - to
        { freq: 329.63, duration: 2 },   // E - you

        // "Happy birthday to you" (verse 2)
        { freq: 261.63, duration: 0.5 }, // C - Hap-
        { freq: 261.63, duration: 0.5 }, // C - py
        { freq: 293.66, duration: 1 },   // D - birth-
        { freq: 261.63, duration: 1 },   // C - day
        { freq: 392.00, duration: 1 },   // G - to
        { freq: 349.23, duration: 2 },   // F - you

        // "Happy birthday dear [name]" (verse 3)
        { freq: 261.63, duration: 0.5 }, // C - Hap-
        { freq: 261.63, duration: 0.5 }, // C - py
        { freq: 523.25, duration: 1 },   // C (high) - birth-
        { freq: 440.00, duration: 1 },   // A - day
        { freq: 349.23, duration: 1 },   // F - dear
        { freq: 329.63, duration: 1 },   // E - [name]
        { freq: 293.66, duration: 2 },   // D

        // "Happy birthday to you" (verse 4)
        { freq: 466.16, duration: 0.5 }, // Bb - Hap-
        { freq: 466.16, duration: 0.5 }, // Bb - py
        { freq: 440.00, duration: 1 },   // A - birth-
        { freq: 349.23, duration: 1 },   // F - day
        { freq: 392.00, duration: 1 },   // G - to
        { freq: 349.23, duration: 2 },   // F - you
    ];

    let currentTime = audioContext.currentTime;

    notes.forEach(note => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.frequency.value = note.freq;
        osc.type = 'sine';

        gain.gain.setValueAtTime(0.3, currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);

        osc.start(currentTime);
        osc.stop(currentTime + note.duration);

        currentTime += note.duration;
    });

    // Loop the music
    setTimeout(() => {
        if (isPlaying) {
            playBirthdayMusic();
        }
    }, currentTime * 1000);
}

function stopMusic() {
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
}
