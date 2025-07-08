// App state
let currentPage = 0;
let selectedProtocol = null;
let completedTrainings = [];
let welcomeMessageIndex = 0;
let completionMessageIndex = 0;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    if (document.readyState === 'complete') {
        initApp();
    } else {
        window.addEventListener('load', initApp);
    }
    
    function initApp() {
        // Generate oxygen effect
        generateOxygenEffect();
        
        // Show loading animation
        setTimeout(function() {
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                loadingOverlay.style.opacity = '0';
                setTimeout(function() {
                    loadingOverlay.style.display = 'none';
                    startWelcomeSequence();
                }, 1000);
            }
        }, 2500);
    }
});

// Create dynamic oxygen particles
function generateOxygenEffect() {
    const oxygenBg = document.getElementById('oxygenBackground');
    
    if (!oxygenBg) return;
    
    const fragment = document.createDocumentFragment();
    
    // Large bubbles
    const bubbleCount = 15;
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        const size = Math.random() * 80 + 40;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 15;
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.animationDelay = `${delay}s`;
        
        fragment.appendChild(bubble);
    }
    
    // Small particles
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 10 + 3;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const xMove = (Math.random() - 0.5) * 200;
        const yMove = (Math.random() - 0.5) * 200;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${startX}%`;
        particle.style.top = `${startY}%`;
        particle.style.setProperty('--x', `${xMove}px`);
        particle.style.setProperty('--y', `${yMove}px`);
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        fragment.appendChild(particle);
    }
    
    oxygenBg.appendChild(fragment);
}

// Welcome sequence
function startWelcomeSequence() {
    const messages = [
        'welcomeMessage1',
        'welcomeMessage2', 
        'welcomeMessage3'
    ];
    
    function showNextMessage() {
        if (welcomeMessageIndex < messages.length) {
            // Hide previous message first
            if (welcomeMessageIndex > 0) {
                const prevMessageEl = document.getElementById(messages[welcomeMessageIndex - 1]);
                prevMessageEl.classList.remove('show');
            }
            
            // Show current message
            const messageEl = document.getElementById(messages[welcomeMessageIndex]);
            messageEl.classList.add('show');
            
            welcomeMessageIndex++;
            
            if (welcomeMessageIndex < messages.length) {
                setTimeout(showNextMessage, 3000);
            } else {
                // Show the "Next" button after last message appears
                const nextBtn = document.getElementById('welcomeNextBtn');
                if (nextBtn) {
                    nextBtn.style.display = 'inline-flex';
                }
            }

        }
    }
    
    setTimeout(showNextMessage, 1000);
}

// Page navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    document.getElementById(pageId).classList.add('active');
}

// Protocol selection
function selectProtocol(protocol) {
    selectedProtocol = protocol;
    
    // Add visual feedback
    const cards = document.querySelectorAll('.protocol-card');
    cards.forEach(card => {
        card.style.opacity = '0.5';
        card.style.transform = 'scale(0.95)';
    });
    
    // Highlight selected card
    event.currentTarget.style.opacity = '1';
    event.currentTarget.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
        if (protocol === 'binaural') {
            // Navigate directly to binaural beats page
            showPage('binauralBeatsPage');
            // Preload binaural audio files for instant playback
            setTimeout(preloadBinauralAudio, 500);
        } else {
            // Navigate to scenario selection page
            showPage('scenarioSelectionPage');
        }
    }, 1000);
}

// Navigation functions
function goBack() {
    if (document.getElementById('trainingPage').classList.contains('active')) {
        showPage('scenarioPage');
        // Reset protocol selection
        selectedProtocol = null;
        document.getElementById('nextButton').disabled = true;
        document.querySelectorAll('.protocol-card').forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        });
        // Hide music status
        document.getElementById('musicStatus').style.display = 'none';
    } else if (document.getElementById('scenarioPage').classList.contains('active')) {
        restartPlatform();
    } else if (document.getElementById('binauralBeatsPage').classList.contains('active')) {
        goBackFromBinaural();
    } else if (document.getElementById('scenarioSelectionPage').classList.contains('active')) {
        goBackFromScenario();
    } else if (document.getElementById('peripheralVisionPage').classList.contains('active')) {
        exitVisionTraining();
    } else if (document.getElementById('movingFocusPage').classList.contains('active')) {
        exitMovingTraining();
    } else if (document.getElementById('breathingPage').classList.contains('active')) {
        exitBreathingTraining();
    } else if (document.getElementById('bodyScanPage').classList.contains('active')) {
        exitBodyScanTraining();
    }
}

function goNext() {
    if (document.getElementById('scenarioPage').classList.contains('active') && selectedProtocol) {
        showMusicStatus();
        showPage('trainingPage');
    } else if (document.getElementById('trainingPage').classList.contains('active')) {
        completeSession();
    }
}

// Show protocol selection message
function showProtocolMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 30px;
        border-radius: 15px;
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-green);
        text-align: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        border: 2px solid var(--accent-blue);
        opacity: 0;
        transition: opacity 0.5s ease;
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 500);
    }, 1500);
}

// Show music status
function showMusicStatus() {
    const musicStatus = document.getElementById('musicStatus');
    const musicText = document.getElementById('musicStatusText');
    
    if (selectedProtocol === 'binaural') {
        if (currentlyPlayingBinauralFrequency) {
            musicText.textContent = `${currentlyPlayingBinauralFrequency} Binaural Beats Playing`;
        } else {
            musicText.textContent = 'Binaural Beats Therapy';
        }
    } else {
        // Show specific scenario name if available
        if (currentlyPlayingScenarioName) {
            musicText.textContent = `${currentlyPlayingScenarioName} Playing`;
        } else {
            musicText.textContent = 'Scenario Background Playing';
        }
    }
    
    musicStatus.style.display = 'flex';
    musicStatus.style.opacity = '0';
    setTimeout(() => {
        musicStatus.style.transition = 'opacity 0.5s ease';
        musicStatus.style.opacity = '1';
    }, 100);
}

// Training navigation
function startTraining(trainingType) {
    // Add visual feedback
    event.currentTarget.style.transform = 'scale(0.95)';
    setTimeout(() => {
        event.currentTarget.style.transform = 'scale(1)';
    }, 200);
    
    // Navigate to specific training
    if (trainingType === 'peripheral') {
        showPage('peripheralVisionPage');
        return;
    }
    
    if (trainingType === 'moving') {
        showPage('movingFocusPage');
        initializeMovingFocusTrainer();
        return;
    }
    
    if (trainingType === 'breath') {
        showPage('breathingPage');
        initializeBreathingTrainer();
        return;
    }
    
    if (trainingType === 'bodyscan') {
        showPage('bodyScanPage');
        return;
    }
    
    // Show training message for other trainings (none remaining)
    showTrainingMessage(`Starting ${trainingType} training...`);
    
    // Mark as completed and check if all done
    if (!completedTrainings.includes(trainingType)) {
        completedTrainings.push(trainingType);
        
        // Update visual state of completed training
        event.currentTarget.style.background = 'linear-gradient(135deg, rgba(110, 165, 177, 0.1), rgba(28, 78, 59, 0.1))';
        event.currentTarget.style.borderLeft = '5px solid var(--accent-blue)';
        
        // Add checkmark
        const checkmark = document.createElement('div');
        checkmark.innerHTML = '<i class="fas fa-check"></i>';
        checkmark.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: var(--accent-blue);
            color: white;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        `;
        event.currentTarget.appendChild(checkmark);
        
        // Check if all trainings completed
        if (completedTrainings.length === 4) {
            setTimeout(() => {
                document.getElementById('nextTrainingButton').style.display = 'block';
                document.getElementById('nextTrainingButton').textContent = 'Complete Session ✓';
            }, 1000);
        }
    }
}

// Vision Training Variables
const visionColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
const visionColorNames = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Cyan'];

let visionGameState = {
    isPlaying: false,
    currentRound: 0,
    score: 0,
    targetColor: '',
    targetColorName: '',
    startTime: 0,
    responseTimes: [],
    correctClicks: 0,
    totalRounds: 0,
    gameInterval: null,
    maxRounds: 20,
    roundCompleted: false
};

// Vision Training Functions
function startVisionTraining() {
    const colorIndex = Math.floor(Math.random() * visionColors.length);
    visionGameState.targetColor = visionColors[colorIndex];
    visionGameState.targetColorName = visionColorNames[colorIndex];
    
    // Update central dot to show target color
    const centralDot = document.querySelector('.vision-central-dot');
    centralDot.style.backgroundColor = visionGameState.targetColor;
    centralDot.style.borderColor = visionGameState.targetColor;
    centralDot.style.boxShadow = `
        0 0 25px ${visionGameState.targetColor},
        0 0 50px ${visionGameState.targetColor}40
    `;
    
    // Update target color name display
    document.getElementById('visionTargetColorName').textContent = visionGameState.targetColorName;
    
    document.getElementById('visionInstructions').classList.add('hidden');
    startVisionCountdown();
}

function startVisionCountdown() {
    const countdownEl = document.getElementById('visionCountdown');
    countdownEl.classList.remove('hidden');
    let count = 3;
    
    const countInterval = setInterval(() => {
        countdownEl.textContent = count;
        countdownEl.style.animation = 'none';
        setTimeout(() => {
            countdownEl.style.animation = 'countdownPulse 1s ease-in-out';
        }, 10);
        count--;
        
        if (count < 0) {
            clearInterval(countInterval);
            countdownEl.classList.add('hidden');
            startVisionGame();
        }
    }, 1000);
}

function startVisionGame() {
    visionGameState.isPlaying = true;
    visionGameState.currentRound = 0;
    visionGameState.score = 0;
    visionGameState.responseTimes = [];
    visionGameState.correctClicks = 0;
    visionGameState.totalRounds = 0;
    visionGameState.roundCompleted = false;
    
    nextVisionRound();
    
    visionGameState.gameInterval = setInterval(() => {
        if (visionGameState.currentRound >= visionGameState.maxRounds) {
            endVisionGame();
        } else {
            nextVisionRound();
        }
    }, 1500);
}

function nextVisionRound() {
    if (visionGameState.currentRound >= visionGameState.maxRounds) {
        endVisionGame();
        return;
    }
    
    visionGameState.currentRound++;
    visionGameState.startTime = Date.now();
    visionGameState.roundCompleted = false;
    
    const lights = document.querySelectorAll('.vision-light');
    
    // Remove previous target class and animations
    lights.forEach(light => {
        light.classList.remove('target', 'correct-feedback', 'wrong-feedback');
    });
    
    // Generate random colors for all lights, ensuring they're different from target
    const availableColors = visionColors.filter(color => color !== visionGameState.targetColor);
    const currentColors = [];
    
    // Fill 3 positions with non-target colors
    for (let i = 0; i < 3; i++) {
        const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
        currentColors.push(randomColor);
    }
    
    // Add target color once
    currentColors.push(visionGameState.targetColor);
    
    // Shuffle the array to randomize positions
    for (let i = currentColors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentColors[i], currentColors[j]] = [currentColors[j], currentColors[i]];
    }
    
    // Apply colors to lights
    lights.forEach((light, index) => {
        light.style.backgroundColor = currentColors[index];
        light.style.boxShadow = `0 0 25px ${currentColors[index]}40, inset 0 1px 0 rgba(255, 255, 255, 0.2)`;
        
        if (currentColors[index] === visionGameState.targetColor) {
            light.classList.add('target');
        }
    });
    
    updateVisionDisplay();
}

function updateVisionDisplay() {
    document.getElementById('visionRound').textContent = `${visionGameState.currentRound}/${visionGameState.maxRounds}`;
    document.getElementById('visionScore').textContent = visionGameState.score;
    
    if (visionGameState.responseTimes.length > 0) {
        const avgResponse = visionGameState.responseTimes.reduce((a, b) => a + b, 0) / visionGameState.responseTimes.length;
        document.getElementById('visionAvgResponse').textContent = Math.round(avgResponse);
        
        const bestTime = Math.min(...visionGameState.responseTimes);
        document.getElementById('visionBestTime').textContent = Math.round(bestTime);
    }
    
    if (visionGameState.totalRounds > 0) {
        const accuracy = (visionGameState.correctClicks / visionGameState.totalRounds) * 100;
        document.getElementById('visionAccuracy').textContent = Math.round(accuracy);
    }
}

function handleVisionLightClick(event) {
    if (!visionGameState.isPlaying || visionGameState.roundCompleted) return;
    
    const responseTime = Date.now() - visionGameState.startTime;
    const clickedColor = event.target.style.backgroundColor;
    const targetRGB = hexToRgb(visionGameState.targetColor);
    const targetRGBString = `rgb(${targetRGB.r}, ${targetRGB.g}, ${targetRGB.b})`;
    
    visionGameState.roundCompleted = true;
    visionGameState.totalRounds++;
    
    if (clickedColor === targetRGBString) {
        visionGameState.correctClicks++;
        visionGameState.score += 10;
        visionGameState.responseTimes.push(responseTime);
        
        event.target.classList.add('correct-feedback');
        setTimeout(() => {
            event.target.classList.remove('correct-feedback');
        }, 600);
    } else {
        event.target.classList.add('wrong-feedback');
        setTimeout(() => {
            event.target.classList.remove('wrong-feedback');
        }, 600);
    }
    
    updateVisionDisplay();
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function endVisionGame() {
    visionGameState.isPlaying = false;
    clearInterval(visionGameState.gameInterval);
    
    const avgResponse = visionGameState.responseTimes.length > 0 
        ? visionGameState.responseTimes.reduce((a, b) => a + b, 0) / visionGameState.responseTimes.length 
        : 0;
    const accuracy = visionGameState.totalRounds > 0 
        ? (visionGameState.correctClicks / visionGameState.totalRounds) * 100 
        : 0;
    const bestTime = visionGameState.responseTimes.length > 0 
        ? Math.min(...visionGameState.responseTimes) 
        : 0;
    
    document.getElementById('visionFinalStats').innerHTML = `
        <p>Final Score: ${visionGameState.score} points</p>
        <p>Rounds Completed: ${visionGameState.totalRounds}/${visionGameState.maxRounds}</p>
        <p>Correct Clicks: ${visionGameState.correctClicks}</p>
        <p>Accuracy: ${Math.round(accuracy)}%</p>
        <p>Average Response Time: ${avgResponse > 0 ? Math.round(avgResponse) + 'ms' : 'N/A'}</p>
        <p>Best Response Time: ${bestTime > 0 ? Math.round(bestTime) + 'ms' : 'N/A'}</p>
        <p>Target Color: ${visionGameState.targetColorName}</p>
    `;
    
    document.getElementById('visionResults').classList.remove('hidden');
}

function exitVisionGame() {
    if (visionGameState.isPlaying) {
        if (confirm('Are you sure you want to exit the current training?')) {
            endVisionGame();
        }
    } else {
        exitVisionTraining();
    }
}

function exitVisionTraining() {
    // Mark peripheral training as completed
    if (!completedTrainings.includes('peripheral')) {
        completedTrainings.push('peripheral');
        
        // Find the peripheral training card and mark it as completed
        const trainingCards = document.querySelectorAll('.training-card');
        trainingCards.forEach(card => {
            if (card.onclick && card.onclick.toString().includes('peripheral')) {
                card.style.background = 'linear-gradient(135deg, rgba(110, 165, 177, 0.1), rgba(28, 78, 59, 0.1))';
                card.style.borderLeft = '5px solid var(--accent-blue)';
                
                // Add checkmark if not already present
                if (!card.querySelector('.fas.fa-check')) {
                    const checkmark = document.createElement('div');
                    checkmark.innerHTML = '<i class="fas fa-check"></i>';
                    checkmark.style.cssText = `
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: var(--accent-blue);
                        color: white;
                        width: 25px;
                        height: 25px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                    `;
                    card.appendChild(checkmark);
                }
            }
        });
        
        // Check if all trainings completed
        if (completedTrainings.length === 4) {
            setTimeout(() => {
                document.getElementById('nextTrainingButton').style.display = 'block';
                document.getElementById('nextTrainingButton').textContent = 'Complete Session ✓';
            }, 1000);
        }
    }
    
    showPage('trainingPage');
}

function resetVisionGame() {
    document.getElementById('visionResults').classList.add('hidden');
    document.getElementById('visionInstructions').classList.remove('hidden');
    
    // Reset lights
    const lights = document.querySelectorAll('.vision-light');
    lights.forEach(light => {
        light.style.backgroundColor = 'rgba(110, 165, 177, 0.3)';
        light.style.boxShadow = '0 0 25px rgba(255, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
        light.classList.remove('target', 'correct-feedback', 'wrong-feedback');
    });
    
    // Reset central dot to default
    const centralDot = document.querySelector('.vision-central-dot');
    centralDot.style.backgroundColor = 'var(--primary-green)';
    centralDot.style.borderColor = 'var(--primary-green)';
    centralDot.style.boxShadow = '0 0 25px rgba(28, 78, 59, 0.8), 0 0 50px rgba(28, 78, 59, 0.4)';
    
    // Reset target color name
    document.getElementById('visionTargetColorName').textContent = '-';
    
    // Reset game state
    visionGameState = {
        isPlaying: false,
        currentRound: 0,
        score: 0,
        targetColor: '',
        targetColorName: '',
        startTime: 0,
        responseTimes: [],
        correctClicks: 0,
        totalRounds: 0,
        gameInterval: null,
        maxRounds: 20,
        roundCompleted: false
    };
    
    updateVisionDisplay();
}

// Add event listeners for vision training when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add vision light click listeners after the page is loaded
    setTimeout(() => {
        const visionLights = document.querySelectorAll('.vision-light');
        visionLights.forEach(light => {
            light.addEventListener('click', handleVisionLightClick);
        });
    }, 100);
});

// Show training message
function showTrainingMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 25px;
        border-radius: 15px;
        font-size: 16px;
        font-weight: 600;
        color: var(--primary-green);
        text-align: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        border: 2px solid var(--accent-blue);
        opacity: 0;
        transition: opacity 0.5s ease;
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 500);
    }, 2000);
}

// Complete session
function completeSession() {
    // Hide all other pages first
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Reset completion messages
    document.querySelectorAll('.completion-message').forEach(msg => {
        msg.classList.remove('show');
    });
    
    // Show completion page
    showPage('completionPage');
    startCompletionSequence();
}

// Completion sequence
function startCompletionSequence() {
    const messages = [
        'completionMessage1',
        'completionMessage2',
        'completionMessage3',
        'completionMessage4'
    ];
    
    completionMessageIndex = 0; // Reset index
    
    function showNextCompletionMessage() {
        if (completionMessageIndex < messages.length) {
            // Hide previous message first
            if (completionMessageIndex > 0) {
                const prevMessageEl = document.getElementById(messages[completionMessageIndex - 1]);
                prevMessageEl.classList.remove('show');
            }
            
            // Show current message
            const messageEl = document.getElementById(messages[completionMessageIndex]);
            messageEl.classList.add('show');
            
            completionMessageIndex++;
            
            if (completionMessageIndex < messages.length) {
                setTimeout(showNextCompletionMessage, 3000);
            } else {
                // After all messages are shown, show the quit button
                setTimeout(() => {
                    showQuitButton();
                }, 2000);
            }
        }
    }
    
    setTimeout(showNextCompletionMessage, 1000);
}

// Show quit button after completion messages
function showQuitButton() {
    const quitButton = document.getElementById('quitButton');
    if (quitButton) {
        quitButton.style.display = 'inline-flex';
        setTimeout(() => {
            quitButton.classList.add('show');
        }, 100);
    }
}

// Quit application
function quitApplication() {
    // Show goodbye message
    const farewell = document.createElement('div');
    farewell.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--primary-green);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        opacity: 0;
        transition: opacity 1s ease;
    `;
    
    farewell.innerHTML = `
        <div style="
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background-color: var(--white);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-green);
            font-weight: bold;
            font-size: 40px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
        ">O₂</div>
        <div style="
            color: var(--white);
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 20px;
            text-align: center;
        ">Thank you for using</div>
        <div style="
            color: var(--white);
            font-size: 20px;
            font-weight: 400;
            text-align: center;
            opacity: 0.9;
        ">Cocoon Fitness & Wellness Training</div>
        <div style="
            color: rgba(255, 255, 255, 0.7);
            font-size: 16px;
            margin-top: 30px;
            text-align: center;
        ">You can now close this window</div>
    `;
    
    document.body.appendChild(farewell);
    
    setTimeout(() => {
        farewell.style.opacity = '1';
    }, 100);
    
    // Try to close the window after showing goodbye message
    setTimeout(() => {
        // For web browsers, this will only work if the window was opened by JavaScript
        if (window.close) {
            window.close();
        } else {
            // If window.close() doesn't work, show a message
            const closeMessage = document.createElement('div');
            closeMessage.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.2);
                color: white;
                padding: 15px 25px;
                border-radius: 25px;
                font-size: 14px;
                backdrop-filter: blur(10px);
                text-align: center;
            `;
            closeMessage.textContent = 'Please close this browser tab or window manually';
            farewell.appendChild(closeMessage);
        }
    }, 3000);
}

// Restart platform
function restartPlatform() {
    // Reset state
    currentPage = 0;
    selectedProtocol = null;
    completedTrainings = [];
    welcomeMessageIndex = 0;
    completionMessageIndex = 0;
    
    // Hide music status
    document.getElementById('musicStatus').style.display = 'none';
    
    // Reset welcome messages
    document.querySelectorAll('.welcome-message').forEach(msg => {
        msg.classList.remove('show');
    });
    
    // Reset completion messages
    document.querySelectorAll('.completion-message').forEach(msg => {
        msg.classList.remove('show');
    });
    
    // Reset protocol cards
    document.querySelectorAll('.protocol-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    });
    
    // Reset training cards
    document.querySelectorAll('.training-card').forEach(card => {
        card.style.background = '';
        card.style.borderLeft = '';
        const checkmark = card.querySelector('.fas.fa-check');
        if (checkmark && checkmark.parentElement) {
            checkmark.parentElement.remove();
        }
    });
    
    // Reset buttons
    document.getElementById('nextTrainingButton').style.display = 'block';
    document.getElementById('nextTrainingButton').textContent = 'Complete Session';
    document.getElementById('nextButton').disabled = true;
    
    // Reset binaural beats pages
    document.querySelectorAll('#binauralBeatsPage').forEach(page => {
        page.classList.remove('active');
    });
    
    // Stop any playing binaural audio
    if (typeof stopAllBinauralAudio === 'function') {
        stopAllBinauralAudio();
    }
    
    // Reset scenario selection page
    document.querySelectorAll('#scenarioSelectionPage').forEach(page => {
        page.classList.remove('active');
    });
    
    // Reset peripheral vision training page
    document.querySelectorAll('#peripheralVisionPage').forEach(page => {
        page.classList.remove('active');
    });
    
    // Reset moving focus training page
    document.querySelectorAll('#movingFocusPage').forEach(page => {
        page.classList.remove('active');
        page.classList.remove('training-mode');
    });
    
    // Stop any running moving focus training
    if (movingFocusTrainer && movingFocusTrainer.isTraining) {
        movingFocusTrainer.stopTraining();
    }
    
    // Reset breathing training page
    document.querySelectorAll('#breathingPage').forEach(page => {
        page.classList.remove('active');
    });
    
    // Stop any running breathing training
    if (breathingIsPlaying) {
        pauseBreathingSession();
        resetBreathingSession();
    }
    
    // Reset breathing screens
    if (breathingSession) breathingSession.classList.remove('active');
    if (breathingPreparationScreen) breathingPreparationScreen.classList.remove('active');
    if (breathingModeSelection) breathingModeSelection.style.display = 'none';
    
    breathingCurrentMode = null;
    breathingCurrentModeKey = null;
    
    // Reset body scan training page
    document.querySelectorAll('#bodyScanPage').forEach(page => {
        page.classList.remove('active');
    });
    
    // Reset body scan screens
    if (document.getElementById('bodyScanMeditationPage')) {
        document.getElementById('bodyScanMeditationPage').style.display = 'none';
    }
    if (document.getElementById('bodyScanBenefitsPage')) {
        document.getElementById('bodyScanBenefitsPage').style.display = 'block';
    }
    
    // Go back to welcome
    showPage('welcomePage');
    setTimeout(startWelcomeSequence, 500);
}

// Keyboard navigation
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        // Go back to previous page or restart
        if (document.getElementById('trainingPage').classList.contains('active')) {
            showPage('scenarioPage');
        } else if (document.getElementById('scenarioPage').classList.contains('active')) {
            restartPlatform();
        }
    }
});

// Preload all binaural beats audio files
function preloadBinauralAudio() {
    const audioElements = ['thetaAudio', 'alphaAudio', 'betaAudio', 'gammaAudio'];
    audioElements.forEach(id => {
        const audio = document.getElementById(id);
        if (audio) {
            // Force load the audio
            audio.load();
            // Preload a small amount to ensure quick playback
            audio.addEventListener('canplaythrough', function() {
                console.log(`${id} preloaded successfully`);
            }, { once: true });
        }
    });
}

// Binaural Beats Navigation Functions
function goBackFromBinaural() {
    // Stop any playing binaural audio
    stopAllBinauralAudio();
    
    // Reset protocol selection
    selectedProtocol = null;
    document.getElementById('nextButton').disabled = true;
    document.querySelectorAll('.protocol-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    });
    showPage('scenarioPage');
}

function proceedToTraining() {
    // Show music status for binaural beats or scenarios
    showMusicStatus();
    
    // Show/hide music control button based on whether audio is playing
    const musicControlBtn = document.getElementById('musicControlBtn');
    if (musicControlBtn) {
        if (currentlyPlayingAudio) {
            musicControlBtn.style.display = 'flex';
            updateMusicControlButton(currentlyPlayingAudio.paused);
        } else {
            musicControlBtn.style.display = 'none';
        }
    }
    
    showPage('trainingPage');
}

// Binaural Beats Audio Functions
function playBinauralFrequency(frequency) {
    // Get the audio element first
    const audioElement = document.getElementById(frequency + 'Audio');
    if (!audioElement) {
        console.error(`Audio element with ID ${frequency}Audio not found`);
        return;
    }
    
    // Stop any currently playing audio first, but exclude the target audio
    const audioElements = document.querySelectorAll('.frequency-card audio');
    audioElements.forEach(audio => {
        if (audio !== audioElement && !audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
    
    // Remove all playing classes
    document.querySelectorAll('.frequency-card').forEach(card => {
        card.classList.remove('playing', 'loading');
    });
    
    // Get frequency name for display
    const frequencyNames = {
        'theta': 'Theta (4-8 Hz)',
        'alpha': 'Alpha (8-14 Hz)',
        'beta': 'Beta (14-30 Hz)',
        'gamma': 'Gamma (30-100 Hz)'
    };
    currentlyPlayingBinauralFrequency = frequencyNames[frequency] || 'Binaural Beats';
    
    // Show loading state
    audioElement.parentElement.classList.add('loading');
    
    // Force load the audio if not already loaded
    if (audioElement.readyState < 2) {
        audioElement.load();
    }
    
    // Set current audio reference
    currentlyPlayingAudio = audioElement;
    
    // Add a small delay to prevent race condition
    setTimeout(() => {
        // Play the audio with proper error handling
        const playPromise = audioElement.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log(`Playing ${frequency} binaural beats`);
                
                // Remove loading state and add playing state
                audioElement.parentElement.classList.remove('loading');
                audioElement.parentElement.classList.add('playing');
                
            }).catch(error => {
                console.error('Error playing binaural audio:', error);
                
                // Remove loading state on error
                audioElement.parentElement.classList.remove('loading');
                
                // Only show error message if it's not an AbortError from rapid clicking
                if (error.name !== 'AbortError') {
                    showTrainingMessage('Binaural beats audio could not be played. Please check your connection or try again.');
                }
                
                // Reset current audio reference
                currentlyPlayingAudio = null;
                currentlyPlayingBinauralFrequency = null;
            });
        }
    }, 50); // Small delay to prevent race condition
    
    // Set up event listener for when audio ends (only once)
    audioElement.removeEventListener('ended', handleAudioEnd);
    audioElement.addEventListener('ended', handleAudioEnd);
    
    // Set up event listener for pause/play to update visual feedback (only once)
    audioElement.removeEventListener('pause', handleAudioPause);
    audioElement.removeEventListener('play', handleAudioPlay);
    audioElement.addEventListener('pause', handleAudioPause);
    audioElement.addEventListener('play', handleAudioPlay);
}

// Event handler functions to avoid duplicate listeners
function handleAudioEnd() {
    // Remove playing class when audio ends
    if (this.parentElement) {
        this.parentElement.classList.remove('playing', 'loading');
    }
    currentlyPlayingAudio = null;
    currentlyPlayingBinauralFrequency = null;
    currentlyPlayingScenarioName = null;
}

function handleAudioPause() {
    // Update button icon when paused
    updateMusicControlButton(true);
}

function handleAudioPlay() {
    // Update button icon when playing
    updateMusicControlButton(false);
}

// Function to stop all binaural audio
function stopAllBinauralAudio() {
    const audioElements = document.querySelectorAll('.frequency-card audio');
    audioElements.forEach(audio => {
        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
    
    // Remove all playing classes
    document.querySelectorAll('.frequency-card').forEach(card => {
        card.classList.remove('playing');
    });
    
    currentlyPlayingAudio = null;
    currentlyPlayingBinauralFrequency = null;
}

// Scenario Navigation Functions
function goBackFromScenario() {
    // Stop any playing audio
    stopAllScenarioAudio();
    
    // Reset protocol selection
    selectedProtocol = null;
    document.getElementById('nextButton').disabled = true;
    document.querySelectorAll('.protocol-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    });
    showPage('scenarioPage');
}

// Global variable to track currently playing audio
let currentlyPlayingAudio = null;
let currentlyPlayingScenarioName = null;
let currentlyPlayingBinauralFrequency = null;

// Function to play scenario audio
function playScenarioAudio(audioId) {
    // Get the audio element first
    const audioElement = document.getElementById(audioId);
    if (!audioElement) {
        console.error(`Audio element with ID ${audioId} not found`);
        return;
    }
    
    // Stop any currently playing audio first, but exclude the target audio
    const audioElements = document.querySelectorAll('.scenarios-container audio');
    audioElements.forEach(audio => {
        if (audio !== audioElement && !audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
    
    // Remove all playing classes
    document.querySelectorAll('.scenario-button').forEach(btn => {
        btn.classList.remove('playing', 'loading');
    });
    
    // Get scenario name for display
    const scenarioNames = {
        'scenario1': 'Ocean Sounds',
        'scenario2': 'Forest Sounds', 
        'scenario3': 'Sunrise Sounds',
        'scenario4': 'Evening Sounds',
        'scenario5': 'Farm Sounds',
        'scenario6': 'Lake Sounds'
    };
    currentlyPlayingScenarioName = scenarioNames[audioId] || 'Background Music';
    
    // Show loading state
    audioElement.parentElement.classList.add('loading');
    
    // Force load the audio if not already loaded
    if (audioElement.readyState < 2) {
        audioElement.load();
    }
    
    // Set current audio reference
    currentlyPlayingAudio = audioElement;
    
    // Add a small delay to prevent race condition
    setTimeout(() => {
        // Play the audio with proper error handling
        const playPromise = audioElement.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log(`Playing ${audioId}`);
                
                // Remove loading state and add playing state
                audioElement.parentElement.classList.remove('loading');
                audioElement.parentElement.classList.add('playing');
                
            }).catch(error => {
                console.error('Error playing audio:', error);
                
                // Remove loading state on error
                audioElement.parentElement.classList.remove('loading');
                
                // Only show error message if it's not an AbortError from rapid clicking
                if (error.name !== 'AbortError') {
                    showTrainingMessage('Audio could not be played. Please check your connection or try again.');
                }
                
                // Reset current audio reference
                currentlyPlayingAudio = null;
                currentlyPlayingScenarioName = null;
            });
        }
    }, 50); // Small delay to prevent race condition
    
    // Set up event listener for when audio ends (reuse the same handler)
    audioElement.removeEventListener('ended', handleAudioEnd);
    audioElement.addEventListener('ended', handleAudioEnd);
    
    // Set up event listener for pause/play to update visual feedback (reuse handlers)
    audioElement.removeEventListener('pause', handleAudioPause);
    audioElement.removeEventListener('play', handleAudioPlay);
    audioElement.addEventListener('pause', handleAudioPause);
    audioElement.addEventListener('play', handleAudioPlay);
}

// Function to stop all scenario audio
function stopAllScenarioAudio() {
    const audioElements = document.querySelectorAll('.scenarios-container audio');
    audioElements.forEach(audio => {
        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
    
    // Remove all playing classes
    document.querySelectorAll('.scenario-button').forEach(btn => {
        btn.classList.remove('playing');
    });
    
    currentlyPlayingAudio = null;
    currentlyPlayingScenarioName = null;
}

// Function to toggle audio playback (works for both scenarios and binaural beats)
function toggleAudioPlayback() {
    if (currentlyPlayingAudio) {
        if (currentlyPlayingAudio.paused) {
            // Resume playing
            currentlyPlayingAudio.play().then(() => {
                updateMusicControlButton(false); // false = playing, show pause icon
                console.log('Audio resumed');
            }).catch(error => {
                console.error('Error resuming audio:', error);
            });
        } else {
            // Pause playing
            currentlyPlayingAudio.pause();
            updateMusicControlButton(true); // true = paused, show play icon
            console.log('Audio paused');
        }
    } else {
        console.log('No audio currently playing');
    }
}

// Function to update music control button icon
function updateMusicControlButton(isPaused) {
    const musicControlIcon = document.getElementById('musicControlIcon');
    if (musicControlIcon) {
        if (isPaused) {
            musicControlIcon.className = 'fas fa-play';
        } else {
            musicControlIcon.className = 'fas fa-pause';
        }
    }
}

function proceedToTrainingFromScenario() {
    // Show music status for scenario
    showMusicStatus();
    
    // Show/hide music control button based on whether audio is playing
    const musicControlBtn = document.getElementById('musicControlBtn');
    if (musicControlBtn) {
        if (currentlyPlayingAudio) {
            musicControlBtn.style.display = 'flex';
            updateMusicControlButton(currentlyPlayingAudio.paused);
        } else {
            musicControlBtn.style.display = 'none';
        }
    }
    
    showPage('trainingPage');
}

// Moving Focus Training Class and Functions
class MovingFocusTrainer {
    constructor() {
        this.isTraining = false;
        this.startTime = null;
        this.duration = 3 * 60 * 1000; // 3 minutes in milliseconds
        this.animationFrame = null;
        this.timerInterval = null;
        this.trailDots = [];
        this.maxTrailDots = 15;
        
        // Dot configurations
        this.dots = {
            green: {
                element: null,
                currentX: 0,
                currentY: 0,
                targetX: 0,
                targetY: 0,
                speed: 1.5,
                lastDirectionChange: 0,
                changeInterval: 2000,
                color: 'green'
            },
            blue: {
                element: null,
                currentX: 0,
                currentY: 0,
                targetX: 0,
                targetY: 0,
                speed: 1.8,
                lastDirectionChange: 0,
                changeInterval: 1800,
                color: 'blue'
            },
            red: {
                element: null,
                currentX: 0,
                currentY: 0,
                targetX: 0,
                targetY: 0,
                speed: 1.3,
                lastDirectionChange: 0,
                changeInterval: 2200,
                color: 'red'
            },
            yellow: {
                element: null,
                currentX: 0,
                currentY: 0,
                targetX: 0,
                targetY: 0,
                speed: 1.6,
                lastDirectionChange: 0,
                changeInterval: 1900,
                color: 'yellow'
            },
            purple: {
                element: null,
                currentX: 0,
                currentY: 0,
                targetX: 0,
                targetY: 0,
                speed: 1.4,
                lastDirectionChange: 0,
                changeInterval: 2100,
                color: 'purple'
            }
        };
        
        this.trainingAreaWidth = 0;
        this.trainingAreaHeight = 0;
        this.margin = 50;
        
        this.initializeElements();
        this.setupEventListeners();
    }
    
    initializeElements() {
        this.startButton = document.getElementById('movingStartButton');
        this.stopButton = document.getElementById('movingStopButton');
        this.restartButton = document.getElementById('movingRestartButton');
        this.timerDisplay = document.getElementById('movingTimerDisplay');
        this.timer = document.getElementById('movingTimer');
        this.progressFill = document.getElementById('movingProgressFill');
        this.trainingArea = document.getElementById('movingTrainingArea');
        this.instructionsPanel = document.getElementById('movingInstructionsPanel');
        this.completionMessage = document.getElementById('movingCompletionMessage');
        
        // Initialize dot elements
        this.dots.green.element = document.getElementById('movingFocusDot');
        this.dots.blue.element = document.getElementById('movingBlueDistractor');
        this.dots.red.element = document.getElementById('movingRedDistractor');
        this.dots.yellow.element = document.getElementById('movingYellowDistractor');
        this.dots.purple.element = document.getElementById('movingPurpleDistractor');
    }
    
    setupEventListeners() {
        if (this.startButton) {
            this.startButton.addEventListener('click', () => this.startTraining());
        }
        if (this.stopButton) {
            this.stopButton.addEventListener('click', () => this.stopTraining());
        }
        if (this.restartButton) {
            this.restartButton.addEventListener('click', () => this.resetSession());
        }
        
        // Handle window resize
        window.addEventListener('resize', () => this.updateTrainingAreaDimensions());
    }
    
    updateTrainingAreaDimensions() {
        if (this.trainingArea) {
            const rect = this.trainingArea.getBoundingClientRect();
            this.trainingAreaWidth = rect.width;
            this.trainingAreaHeight = rect.height;
            
            // Initialize all dots with random positions
            Object.keys(this.dots).forEach((key, index) => {
                const dot = this.dots[key];
                // Spread dots across the area initially in a pentagon pattern
                const angle = (index * 72) * Math.PI / 180; // 72 degrees apart for 5 dots
                const radius = Math.min(this.trainingAreaWidth, this.trainingAreaHeight) * 0.25;
                const centerX = this.trainingAreaWidth / 2;
                const centerY = this.trainingAreaHeight / 2;
                
                dot.currentX = centerX + Math.cos(angle) * radius;
                dot.currentY = centerY + Math.sin(angle) * radius;
                dot.targetX = dot.currentX;
                dot.targetY = dot.currentY;
                
                // Generate initial random targets
                this.generateNewTarget(dot);
            });
        }
    }
    
    startTraining() {
        this.isTraining = true;
        this.startTime = Date.now();
        
        // Add training mode class to the moving training page
        const movingPage = document.getElementById('movingFocusPage');
        if (movingPage) {
            movingPage.classList.add('training-mode');
        }
        
        // Update UI
        if (this.instructionsPanel) this.instructionsPanel.style.display = 'none';
        if (this.startButton) this.startButton.style.display = 'none';
        if (this.stopButton) this.stopButton.style.display = 'inline-block';
        if (this.timerDisplay) this.timerDisplay.style.display = 'block';
        if (this.trainingArea) this.trainingArea.style.display = 'block';
        
        // Update training area dimensions and reset direction change timers
        setTimeout(() => {
            this.updateTrainingAreaDimensions();
            const now = Date.now();
            Object.values(this.dots).forEach(dot => {
                dot.lastDirectionChange = now + Math.random() * 1000; // Stagger initial changes
            });
        }, 100);
        
        // Start animations and timer
        this.startTimer();
        this.animate();
    }
    
    stopTraining() {
        this.isTraining = false;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Remove training mode class
        const movingPage = document.getElementById('movingFocusPage');
        if (movingPage) {
            movingPage.classList.remove('training-mode');
        }
        
        this.resetSession();
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const remaining = Math.max(0, this.duration - elapsed);
            const progress = (elapsed / this.duration) * 100;
            
            // Update timer display
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            if (this.timer) {
                this.timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            // Update progress bar
            if (this.progressFill) {
                this.progressFill.style.width = `${Math.min(100, progress)}%`;
            }
            
            // Check if session is complete
            if (remaining <= 0) {
                this.completeSession();
            }
        }, 100);
    }
    
    animate() {
        if (!this.isTraining) return;
        
        const now = Date.now();
        
        // Animate each dot independently
        Object.values(this.dots).forEach(dot => {
            if (!dot.element) return;
            
            // Check if it's time to change direction
            if (now - dot.lastDirectionChange > dot.changeInterval) {
                this.generateNewTarget(dot);
                dot.lastDirectionChange = now;
                // Randomize next change interval
                dot.changeInterval = dot.changeInterval * (0.7 + Math.random() * 0.6); // ±30% variation
            }
            
            // Move towards target with smooth interpolation
            const dx = dot.targetX - dot.currentX;
            const dy = dot.targetY - dot.currentY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 2) {
                // Move towards target
                dot.currentX += (dx / distance) * dot.speed;
                dot.currentY += (dy / distance) * dot.speed;
            } else {
                // Close enough to target, generate new one
                this.generateNewTarget(dot);
                dot.lastDirectionChange = now;
            }
            
            // Add slight random variation for more natural movement
            const randomX = (Math.random() - 0.5) * 1.5;
            const randomY = (Math.random() - 0.5) * 1.5;
            
            const finalX = dot.currentX + randomX;
            const finalY = dot.currentY + randomY;
            
            // Update dot position
            dot.element.style.left = `${finalX - 10}px`; // -10 to center the dot
            dot.element.style.top = `${finalY - 10}px`;
            
            // Add trail effect (reduced frequency for performance)
            if (Math.random() < 0.3) { // Only add trail 30% of the time
                this.addTrailDot(finalX, finalY, dot.color);
            }
        });
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    generateNewTarget(dot) {
        // Generate random target within the training area bounds
        dot.targetX = this.margin + Math.random() * (this.trainingAreaWidth - 2 * this.margin);
        dot.targetY = this.margin + Math.random() * (this.trainingAreaHeight - 2 * this.margin);
        
        // Vary the speed slightly for more natural movement
        let baseSpeed;
        switch(dot.color) {
            case 'green': baseSpeed = 1.5; break;
            case 'blue': baseSpeed = 1.8; break;
            case 'red': baseSpeed = 1.3; break;
            case 'yellow': baseSpeed = 1.6; break;
            case 'purple': baseSpeed = 1.4; break;
            default: baseSpeed = 1.5;
        }
        dot.speed = baseSpeed * (0.8 + Math.random() * 0.4); // Speed variation ±20%
        
        // Vary the direction change interval
        let baseInterval;
        switch(dot.color) {
            case 'green': baseInterval = 2000; break;
            case 'blue': baseInterval = 1800; break;
            case 'red': baseInterval = 2200; break;
            case 'yellow': baseInterval = 1900; break;
            case 'purple': baseInterval = 2100; break;
            default: baseInterval = 2000;
        }
        dot.changeInterval = baseInterval * (0.7 + Math.random() * 0.6); // Between 70%-130% of base
    }
    
    addTrailDot(x, y, color) {
        if (!this.trainingArea) return;
        
        // Create trail dot
        const trailDot = document.createElement('div');
        trailDot.className = `moving-trail-dot ${color}`;
        trailDot.style.left = `${x - 4}px`;
        trailDot.style.top = `${y - 4}px`;
        trailDot.style.opacity = '0.6';
        
        this.trainingArea.appendChild(trailDot);
        this.trailDots.push(trailDot);
        
        // Fade out trail dot
        setTimeout(() => {
            if (trailDot.parentNode) {
                trailDot.style.transition = 'opacity 0.5s ease';
                trailDot.style.opacity = '0';
                setTimeout(() => {
                    if (trailDot.parentNode) {
                        trailDot.parentNode.removeChild(trailDot);
                    }
                }, 500);
            }
        }, 100);
        
        // Limit number of trail dots
        if (this.trailDots.length > this.maxTrailDots) {
            const oldDot = this.trailDots.shift();
            if (oldDot && oldDot.parentNode) {
                oldDot.parentNode.removeChild(oldDot);
            }
        }
    }
    
    completeSession() {
        this.isTraining = false;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Remove training mode class
        const movingPage = document.getElementById('movingFocusPage');
        if (movingPage) {
            movingPage.classList.remove('training-mode');
        }
        
        // Show completion message
        if (this.trainingArea) this.trainingArea.style.display = 'none';
        if (this.timerDisplay) this.timerDisplay.style.display = 'none';
        if (this.stopButton) this.stopButton.style.display = 'none';
        if (this.completionMessage) this.completionMessage.style.display = 'block';
    }
    
    resetSession() {
        this.isTraining = false;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Remove training mode class
        const movingPage = document.getElementById('movingFocusPage');
        if (movingPage) {
            movingPage.classList.remove('training-mode');
        }
        
        // Clear trail dots
        this.trailDots.forEach(dot => {
            if (dot.parentNode) {
                dot.parentNode.removeChild(dot);
            }
        });
        this.trailDots = [];
        
        // Reset UI
        if (this.instructionsPanel) this.instructionsPanel.style.display = 'block';
        if (this.startButton) this.startButton.style.display = 'inline-block';
        if (this.stopButton) this.stopButton.style.display = 'none';
        if (this.timerDisplay) this.timerDisplay.style.display = 'none';
        if (this.trainingArea) this.trainingArea.style.display = 'none';
        if (this.completionMessage) this.completionMessage.style.display = 'none';
        
        // Reset timer and progress
        if (this.timer) this.timer.textContent = '3:00';
        if (this.progressFill) this.progressFill.style.width = '0%';
        
        // Reset all dots to center area
        Object.values(this.dots).forEach(dot => {
            dot.currentX = this.trainingAreaWidth / 2;
            dot.currentY = this.trainingAreaHeight / 2;
            dot.targetX = dot.currentX;
            dot.targetY = dot.currentY;
            dot.lastDirectionChange = 0;
        });
    }
}

// Global moving focus trainer instance
let movingFocusTrainer = null;

// Moving Focus Training Navigation Functions
function exitMovingTraining() {
    // Mark moving training as completed
    if (!completedTrainings.includes('moving')) {
        completedTrainings.push('moving');
        
        // Find the moving training card and mark it as completed
        const trainingCards = document.querySelectorAll('.training-card');
        trainingCards.forEach(card => {
            if (card.onclick && card.onclick.toString().includes('moving')) {
                card.style.background = 'linear-gradient(135deg, rgba(110, 165, 177, 0.1), rgba(28, 78, 59, 0.1))';
                card.style.borderLeft = '5px solid var(--accent-blue)';
                
                // Add checkmark if not already present
                if (!card.querySelector('.fas.fa-check')) {
                    const checkmark = document.createElement('div');
                    checkmark.innerHTML = '<i class="fas fa-check"></i>';
                    checkmark.style.cssText = `
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: var(--accent-blue);
                        color: white;
                        width: 25px;
                        height: 25px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                    `;
                    card.appendChild(checkmark);
                }
            }
        });
        
        // Check if all trainings completed
        if (completedTrainings.length === 4) {
            setTimeout(() => {
                document.getElementById('nextTrainingButton').style.display = 'block';
                document.getElementById('nextTrainingButton').textContent = 'Complete Session ✓';
            }, 1000);
        }
    }
    
    // Stop training if it's running
    if (movingFocusTrainer && movingFocusTrainer.isTraining) {
        movingFocusTrainer.stopTraining();
    }
    
    showPage('trainingPage');
}

// Initialize moving focus trainer when the page becomes active
function initializeMovingFocusTrainer() {
    if (!movingFocusTrainer) {
        setTimeout(() => {
            movingFocusTrainer = new MovingFocusTrainer();
        }, 100);
    }
}

// Breathing Training Functionality
// Breathing therapy configurations based on research document
const breathingModes = {
    calm: {
        title: "Calm Breathing",
        icon: "breathing-icon-leaf",
        inhale: 4000,    // 4 seconds
        exhale: 6000,    // 6 seconds  
        hold: 0,
        instructions: {
            inhale: "Breathe in slowly through your nose, expand your belly...",
            exhale: "Breathe out gently, let your belly fall naturally...",
            ready: "Focus on slow, deep diaphragmatic breathing..."
        },
        preparation: {
            posture: "Sit comfortably with your spine neutral and shoulders relaxed. You may also lie down if preferred. Place one hand on your belly, one on your chest.",
            breathing: "Focus on diaphragmatic (belly) breathing. Your abdomen should expand outward during inhale while chest movement stays minimal.",
            technique: "Inhale through your nose for 4 seconds, then exhale gently for 6 seconds. This 4:6 ratio activates your parasympathetic nervous system.",
            duration: "Session duration: 5-10 minutes for optimal stress relief and relaxation."
        }
    },
    energy: {
        title: "Energy Boost",
        icon: "breathing-icon-energy",
        inhale: 1000,     // 1 second (slowed down from 0.5)
        exhale: 1000,     // 1 second
        hold: 0,
        roundDuration: 30000, // 30 seconds per round
        restDuration: 30000,  // 30 seconds rest between rounds
        instructions: {
            inhale: "Quick inhale through nose...",
            exhale: "Sharp exhale - contract your belly!",
            ready: "Prepare for rapid bellows breathing...",
            rest: "Rest and breathe normally for 30 seconds..."
        },
        preparation: {
            posture: "Sit upright with spine straight - cross-legged on floor or edge of chair with feet flat. Keep chin level and shoulders relaxed.",
            breathing: "Use powerful diaphragmatic movements. Focus on active, forceful exhalations driven by abdominal muscle contractions. Inhalations are passive and reflexive.",
            technique: "Kapalabhati (Skull-Shining Breath): Rapid exhales (~1-2 per second) with sharp abdominal contractions. Each exhale forces air out, inhale happens automatically.",
            duration: "Short bursts of 1-3 minutes total. Start with 20-30 rapid breaths, rest, then repeat.",
            warning: "CAUTION: Avoid if pregnant, have heart disease, uncontrolled hypertension, or epilepsy. Stop if dizzy or lightheaded."
        }
    },
    focus: {
        title: "Focus Breathing",
        icon: "breathing-icon-focus",
        inhale: 4000,    // 4 seconds
        exhale: 4000,    // 4 seconds
        hold: 2000,      // 2 seconds
        instructions: {
            inhale: "Breathe in through left nostril, expand your belly...",
            exhale: "Breathe out through right nostril, belly falls...",
            hold: "Hold gently, maintain focus and balance...",
            ready: "Prepare for alternate nostril breathing..."
        },
        preparation: {
            posture: "Sit upright with spine straight, shoulders relaxed. Use right hand to control nostrils: thumb for right nostril, ring finger for left. Rest left hand on lap.",
            breathing: "Alternate Nostril Breathing (Nadi Shodhana): Deep diaphragmatic breaths through one nostril at a time. Feel belly expand on inhale, fall on exhale.",
            technique: "Pattern: Inhale left nostril → Exhale right nostril → Inhale right nostril → Exhale left nostril. Equal 4-second phases with optional 2-second holds.",
            duration: "5-10 minutes (about 25-30 complete cycles) for optimal mental clarity and cognitive balance.",
            note: "Ensure nasal passages are clear. Close eyes to minimize distractions and enhance inner focus."
        }
    }
};

// Breathing app state
let breathingCurrentMode = null;
let breathingCurrentModeKey = null;
let breathingIsPlaying = false;
let breathingSessionTimer = null;
let breathingTimer = null;
let breathingSessionDuration = 5 * 60; // 5 minutes
let breathingTimeRemaining = breathingSessionDuration;
let breathingCurrentPhase = 'ready';
let breathingCurrentRound = 1;
let breathingIsResting = false;
let breathingRoundStartTime = null;

// DOM elements for breathing
let breathingModeSelection, breathingPreparationScreen, breathingSession;
let breathingPrepTitle, breathingPrepContent, breathingModeTitle;
let breathingCircle, breathingCircleText, breathingInstructions;
let breathingPlayPauseBtn, breathingTimerEl, breathingProgressCircle, breathingTimingIndicator;

// Initialize breathing trainer when the page becomes active
function initializeBreathingTrainer() {
    if (!breathingModeSelection) {
        setTimeout(() => {
            // Initialize DOM elements
            breathingModeSelection = document.getElementById('breathingModeSelection');
            breathingPreparationScreen = document.getElementById('breathingPreparationScreen');
            breathingSession = document.getElementById('breathingSession');
            breathingPrepTitle = document.getElementById('breathingPrepTitle');
            breathingPrepContent = document.getElementById('breathingPrepContent');
            breathingModeTitle = document.getElementById('breathingModeTitle');
            breathingCircle = document.getElementById('breathingCircle');
            breathingCircleText = document.getElementById('breathingCircleText');
            breathingInstructions = document.getElementById('breathingInstructions');
            breathingPlayPauseBtn = document.getElementById('breathingPlayPauseBtn');
            breathingTimerEl = document.getElementById('breathingTimer');
            breathingProgressCircle = document.getElementById('breathingProgressCircle');
            breathingTimingIndicator = document.getElementById('breathingTimingIndicator');
        }, 100);
    }
    
    // Show intro screen by default
    showBreathingIntroScreen();
}

// Show breathing introduction screen
function showBreathingIntroScreen() {
    const breathingIntroScreen = document.getElementById('breathingIntroScreen');
    const breathingModeSelection = document.getElementById('breathingModeSelection');
    
    if (breathingIntroScreen) breathingIntroScreen.style.display = 'block';
    if (breathingModeSelection) breathingModeSelection.style.display = 'none';
}

// Show breathing mode selection screen
function showBreathingModeSelection() {
    const breathingIntroScreen = document.getElementById('breathingIntroScreen');
    const breathingModeSelection = document.getElementById('breathingModeSelection');
    
    if (breathingIntroScreen) breathingIntroScreen.style.display = 'none';
    if (breathingModeSelection) breathingModeSelection.style.display = 'block';
}

// Go back to breathing intro screen
function backToBreathingIntro() {
    const breathingIntroScreen = document.getElementById('breathingIntroScreen');
    const breathingModeSelection = document.getElementById('breathingModeSelection');
    
    if (breathingModeSelection) breathingModeSelection.style.display = 'none';
    if (breathingIntroScreen) breathingIntroScreen.style.display = 'block';
}

// Enhanced timing indicator animation functions for breathing
function resetBreathingTimingIndicator() {
    if (breathingTimingIndicator) {
        breathingTimingIndicator.className = 'breathing-timing-indicator';
        breathingTimingIndicator.style.animationDuration = '';
    }
}

function startBreathingTimingIndicatorAnimation(duration) {
    if (!breathingTimingIndicator) return;
    
    // Complete reset to ensure animation restarts properly
    resetBreathingTimingIndicator();
    
    // Force a reflow to ensure the reset takes effect
    void breathingTimingIndicator.offsetWidth;
    
    // Set the duration and start animation
    breathingTimingIndicator.style.animationDuration = duration + 'ms';
    breathingTimingIndicator.className = 'breathing-timing-indicator animate';
}

// Show preparation screen
function showBreathingPreparation(modeKey) {
    breathingCurrentModeKey = modeKey;
    breathingCurrentMode = breathingModes[modeKey];
    
    if (breathingPrepTitle) {
        breathingPrepTitle.textContent = breathingCurrentMode.title + " - Preparation";
    }
    
    // Build preparation content
    let content = '';
    
    content += `<div class="breathing-preparation-item">
        <h4><span class="breathing-icon-posture"></span>Recommended Posture</h4>
        <p>${breathingCurrentMode.preparation.posture}</p>
    </div>`;
    
    content += `<div class="breathing-preparation-item">
        <h4><span class="breathing-icon-breathing"></span>Breathing Focus</h4>
        <p>${breathingCurrentMode.preparation.breathing}</p>
    </div>`;
    
    content += `<div class="breathing-preparation-item">
        <h4><span class="breathing-icon-technique"></span>Technique</h4>
        <p>${breathingCurrentMode.preparation.technique}</p>
    </div>`;
    
    content += `<div class="breathing-preparation-item">
        <h4><span class="breathing-icon-time"></span>Session Duration</h4>
        <p>${breathingCurrentMode.preparation.duration}</p>
    </div>`;
    
    if (breathingCurrentMode.preparation.warning) {
        content += `<div class="breathing-preparation-item">
            <h4 class="breathing-warning-text"><span class="breathing-icon-warning"></span>Important Safety Notice</h4>
            <p class="breathing-warning-text">${breathingCurrentMode.preparation.warning}</p>
        </div>`;
    }
    
    if (breathingCurrentMode.preparation.note) {
        content += `<div class="breathing-preparation-item">
            <h4><span class="breathing-icon-note"></span>Additional Notes</h4>
            <p>${breathingCurrentMode.preparation.note}</p>
        </div>`;
    }
    
    if (breathingPrepContent) {
        breathingPrepContent.innerHTML = content;
    }
    
    // Hide mode selection and show preparation screen
    const breathingModeSelection = document.getElementById('breathingModeSelection');
    const breathingPreparationScreen = document.getElementById('breathingPreparationScreen');
    
    if (breathingModeSelection) breathingModeSelection.style.display = 'none';
    if (breathingPreparationScreen) breathingPreparationScreen.style.display = 'block';
}

// Start breathing session
function startBreathingSession() {
    if (breathingModeTitle) {
        breathingModeTitle.innerHTML = `<span class="${breathingCurrentMode.icon}"></span>${breathingCurrentMode.title}`;
    }
    
    // Hide preparation screen and show breathing session
    const breathingPreparationScreen = document.getElementById('breathingPreparationScreen');
    const breathingSession = document.getElementById('breathingSession');
    
    if (breathingPreparationScreen) breathingPreparationScreen.style.display = 'none';
    if (breathingSession) breathingSession.style.display = 'flex';
    
    resetBreathingSession();
    updateBreathingInstructions(breathingCurrentMode.instructions.ready);
}

// Toggle play/pause
function toggleBreathingPlayPause() {
    if (breathingIsPlaying) {
        pauseBreathingSession();
    } else {
        startBreathingSessionTimer();
    }
}

// Start breathing session
function startBreathingSessionTimer() {
    breathingIsPlaying = true;
    if (breathingPlayPauseBtn) breathingPlayPauseBtn.textContent = 'Pause';
    breathingCurrentRound = 1;
    breathingIsResting = false;
    breathingRoundStartTime = Date.now();
    startBreathingTimer();
    startBreathingCycle();
}

// Pause session
function pauseBreathingSession() {
    breathingIsPlaying = false;
    if (breathingPlayPauseBtn) breathingPlayPauseBtn.textContent = 'Resume';
    if (breathingSessionTimer) clearInterval(breathingSessionTimer);
    if (breathingTimer) clearTimeout(breathingTimer);
    if (breathingCircle) breathingCircle.className = 'breathing-circle';
    resetBreathingTimingIndicator();
}

// Start breathing cycle
function startBreathingCycle() {
    if (!breathingIsPlaying) return;

    // Check if this is energy mode and handle rounds/rest
    if (breathingCurrentModeKey === 'energy' && breathingCurrentMode.roundDuration) {
        if (breathingIsResting) {
            // Rest period
            if (breathingCircle) breathingCircle.className = 'breathing-circle';
            if (breathingCircleText) breathingCircleText.textContent = `Rest - Round ${breathingCurrentRound}`;
            updateBreathingInstructions(breathingCurrentMode.instructions.rest);
            resetBreathingTimingIndicator();
            
            breathingTimer = setTimeout(() => {
                if (!breathingIsPlaying) return;
                breathingIsResting = false;
                breathingCurrentRound++;
                startBreathingCycle();
            }, breathingCurrentMode.restDuration);
            return;
        }
    }

    // Inhale phase
    breathingCurrentPhase = 'inhale';
    const duration = breathingCurrentMode.inhale;
    if (breathingCircle) breathingCircle.className = 'breathing-circle inhale';
    if (breathingCircleText) breathingCircleText.textContent = 'Inhale';
    updateBreathingInstructions(breathingCurrentMode.instructions.inhale);
    
    // Start timing indicator animation for inhale
    startBreathingTimingIndicatorAnimation(duration);

    breathingTimer = setTimeout(() => {
        if (!breathingIsPlaying) return;

        // Hold phase (if applicable)
        if (breathingCurrentMode.hold > 0) {
            breathingCurrentPhase = 'hold';
            const holdDuration = breathingCurrentMode.hold;
            if (breathingCircle) breathingCircle.className = 'breathing-circle hold';
            if (breathingCircleText) breathingCircleText.textContent = 'Hold';
            updateBreathingInstructions(breathingCurrentMode.instructions.hold);
            
            // Start timing indicator animation for hold
            startBreathingTimingIndicatorAnimation(holdDuration);

            breathingTimer = setTimeout(() => {
                if (!breathingIsPlaying) return;
                breathingExhalePhase();
            }, holdDuration);
        } else {
            breathingExhalePhase();
        }
    }, duration);
}

// Exhale phase
function breathingExhalePhase() {
    breathingCurrentPhase = 'exhale';
    const duration = breathingCurrentMode.exhale;
    if (breathingCircle) breathingCircle.className = 'breathing-circle exhale';
    if (breathingCircleText) breathingCircleText.textContent = 'Exhale';
    updateBreathingInstructions(breathingCurrentMode.instructions.exhale);
    
    // Start timing indicator animation for exhale
    startBreathingTimingIndicatorAnimation(duration);

    breathingTimer = setTimeout(() => {
        if (!breathingIsPlaying) return;
        
        // For energy mode, check if round is complete
        if (breathingCurrentModeKey === 'energy' && breathingCurrentMode.roundDuration) {
            const cycleTime = breathingCurrentMode.inhale + breathingCurrentMode.exhale + (breathingCurrentMode.hold || 0);
            const elapsedRoundTime = (Date.now() - breathingRoundStartTime);
            
            if (elapsedRoundTime >= breathingCurrentMode.roundDuration) {
                // Round complete, start rest period
                breathingIsResting = true;
                startBreathingCycle();
                return;
            }
        }
        
        startBreathingCycle(); // Repeat cycle
    }, duration);
}

// Update instructions
function updateBreathingInstructions(text) {
    if (breathingInstructions) {
        breathingInstructions.textContent = text;
    }
}

// Start session timer
function startBreathingTimer() {
    breathingSessionTimer = setInterval(() => {
        breathingTimeRemaining--;
        updateBreathingTimerDisplay();
        updateBreathingProgressRing();
        
        if (breathingTimeRemaining <= 0) {
            endBreathingSession();
        }
    }, 1000);
}

// Update timer display
function updateBreathingTimerDisplay() {
    const minutes = Math.floor(breathingTimeRemaining / 60);
    const seconds = breathingTimeRemaining % 60;
    if (breathingTimerEl) {
        breathingTimerEl.textContent = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    }
}

// Update progress ring
function updateBreathingProgressRing() {
    const progress = (breathingSessionDuration - breathingTimeRemaining) / breathingSessionDuration;
    const circumference = 2 * Math.PI * 190;
    const offset = circumference - (progress * circumference);
    if (breathingProgressCircle) {
        breathingProgressCircle.style.strokeDashoffset = offset;
    }
}

// End session
function endBreathingSession() {
    breathingIsPlaying = false;
    if (breathingSessionTimer) clearInterval(breathingSessionTimer);
    if (breathingTimer) clearTimeout(breathingTimer);
    
    if (breathingCircleText) breathingCircleText.textContent = 'Complete!';
    updateBreathingInstructions('Oxygen therapy session completed. Well done!');
    if (breathingPlayPauseBtn) breathingPlayPauseBtn.textContent = 'Restart';
    if (breathingCircle) breathingCircle.className = 'breathing-circle';
}

// Reset session
function resetBreathingSession() {
    breathingTimeRemaining = breathingSessionDuration;
    updateBreathingTimerDisplay();
    if (breathingProgressCircle) breathingProgressCircle.style.strokeDashoffset = '1194';
    if (breathingPlayPauseBtn) breathingPlayPauseBtn.textContent = 'Start';
    if (breathingCircleText) breathingCircleText.textContent = 'Ready';
    breathingIsPlaying = false;
    if (breathingSessionTimer) clearInterval(breathingSessionTimer);
    if (breathingTimer) clearTimeout(breathingTimer);
    resetBreathingTimingIndicator();
}

// Back to mode selection
function backToBreathingModes() {
    pauseBreathingSession();
    resetBreathingSession();
    
    // Hide breathing session and prep screens, show mode selection
    const breathingSession = document.getElementById('breathingSession');
    const breathingPreparationScreen = document.getElementById('breathingPreparationScreen');
    const breathingModeSelection = document.getElementById('breathingModeSelection');
    const breathingIntroScreen = document.getElementById('breathingIntroScreen');
    
    if (breathingSession) breathingSession.style.display = 'none';
    if (breathingPreparationScreen) breathingPreparationScreen.style.display = 'none';
    if (breathingIntroScreen) breathingIntroScreen.style.display = 'none';
    if (breathingModeSelection) breathingModeSelection.style.display = 'block';
    
    breathingCurrentMode = null;
    breathingCurrentModeKey = null;
}

// Exit breathing training
function exitBreathingTraining() {
    // Mark breathing training as completed
    if (!completedTrainings.includes('breath')) {
        completedTrainings.push('breath');
        
        // Find the breathing training card and mark it as completed
        const trainingCards = document.querySelectorAll('.training-card');
        trainingCards.forEach(card => {
            if (card.onclick && card.onclick.toString().includes('breath')) {
                card.style.background = 'linear-gradient(135deg, rgba(110, 165, 177, 0.1), rgba(28, 78, 59, 0.1))';
                card.style.borderLeft = '5px solid var(--accent-blue)';
                
                // Add checkmark if not already present
                if (!card.querySelector('.fas.fa-check')) {
                    const checkmark = document.createElement('div');
                    checkmark.innerHTML = '<i class="fas fa-check"></i>';
                    checkmark.style.cssText = `
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: var(--accent-blue);
                        color: white;
                        width: 25px;
                        height: 25px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                    `;
                    card.appendChild(checkmark);
                }
            }
        });
        
        // Check if all trainings completed
        if (completedTrainings.length === 4) {
            setTimeout(() => {
                document.getElementById('nextTrainingButton').style.display = 'block';
                document.getElementById('nextTrainingButton').textContent = 'Complete Session ✓';
            }, 1000);
        }
    }
    
    // Stop training if it's running
    pauseBreathingSession();
    resetBreathingSession();
    
    // Reset breathing screens
    if (breathingSession) breathingSession.classList.remove('active');
    if (breathingPreparationScreen) breathingPreparationScreen.classList.remove('active');
    showBreathingIntroScreen(); // Reset to intro screen
    
    breathingCurrentMode = null;
    breathingCurrentModeKey = null;
    
    showPage('trainingPage');
}

// Body Scan Training Functionality
function showBodyScanMeditation() {
    document.getElementById('bodyScanBenefitsPage').style.display = 'none';
    document.getElementById('bodyScanMeditationPage').style.display = 'block';
}

function showBodyScanBenefits() {
    document.getElementById('bodyScanMeditationPage').style.display = 'none';
    document.getElementById('bodyScanBenefitsPage').style.display = 'block';
}

function completeBodyScanTraining() {
    // Mark body scan training as completed
    if (!completedTrainings.includes('bodyscan')) {
        completedTrainings.push('bodyscan');
        
        // Find the body scan training card and mark it as completed
        const trainingCards = document.querySelectorAll('.training-card');
        trainingCards.forEach(card => {
            if (card.onclick && card.onclick.toString().includes('bodyscan')) {
                card.style.background = 'linear-gradient(135deg, rgba(110, 165, 177, 0.1), rgba(28, 78, 59, 0.1))';
                card.style.borderLeft = '5px solid var(--accent-blue)';
                
                // Add checkmark if not already present
                if (!card.querySelector('.fas.fa-check')) {
                    const checkmark = document.createElement('div');
                    checkmark.innerHTML = '<i class="fas fa-check"></i>';
                    checkmark.style.cssText = `
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: var(--accent-blue);
                        color: white;
                        width: 25px;
                        height: 25px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                    `;
                    card.appendChild(checkmark);
                }
            }
        });
        
        // Check if all trainings completed
        if (completedTrainings.length === 4) {
            setTimeout(() => {
                document.getElementById('nextTrainingButton').style.display = 'block';
                document.getElementById('nextTrainingButton').textContent = 'Complete Session ✓';
            }, 1000);
        }
    }
    
    // Show completion message
    showTrainingMessage('Body Scan Training completed successfully! Well done.');
    
    // Navigate back to training menu after a delay
    setTimeout(() => {
        exitBodyScanTraining();
    }, 2000);
}

function exitBodyScanTraining() {
    // Reset body scan pages
    document.getElementById('bodyScanMeditationPage').style.display = 'none';
    document.getElementById('bodyScanBenefitsPage').style.display = 'block';
    
    showPage('trainingPage');
}