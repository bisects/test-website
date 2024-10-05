const audioElement = document.getElementById('audio');
const startButton = document.getElementById('startButton');
let audioContext;
let analyser;
let bufferLength;
let dataArray;

// Create Snowflakes
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    snowflake.style.animationDuration = Math.random() * 3 + 2 + 's'; // 2s to 5s duration
    snowflake.style.opacity = Math.random();
    snowflake.style.width = Math.random() * 8 + 'px'; // Random size
    snowflake.style.height = snowflake.style.width;

    document.body.appendChild(snowflake);
    setTimeout(() => snowflake.remove(), 5000); // Remove after falling
}

setInterval(createSnowflake, 100); // Create snowflake every 100ms

// Initialize Web Audio API and Beat Detection
function initializeAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioSource = audioContext.createMediaElementSource(audioElement);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
}

// Detect Beat and Trigger Effects
function detectBeat() {
    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
    const beatThreshold = 160;

    console.log("Average Frequency:", average); // Debugging log

    if (average > beatThreshold) {
        triggerEffects();
    }

    requestAnimationFrame(detectBeat);
}

// Shake and Flash Effects with Color Changes
function triggerEffects() {
    // Random Color for Flashing Effect
    const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    document.body.style.backgroundColor = randomColor;

    // Flash effect
    document.body.classList.add('flash');
    setTimeout(() => document.body.classList.remove('flash'), 100);

    // Shake effect
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 300);
}

// Start Button Event Listener
startButton.addEventListener('click', () => {
    startButton.style.display = 'none'; // Hide button once clicked
    initializeAudio();
    audioElement.play().then(() => {
        detectBeat(); // Start detecting beats
    }).catch((error) => {
        console.error("Error playing audio:", error);
    });
});
