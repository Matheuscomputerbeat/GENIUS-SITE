let sequence = [];
let playerSequence = [];
let score = 0;
let round = 1;
let gameStarted = false;
const maxScore = 10;
let playerName = '';
let playerAge = 0;
let playedGames = 0;

const colors = ['green', 'red', 'yellow', 'blue'];

function startGame() {
    playerName = prompt("Digite seu nome:");
    playerAge = parseInt(prompt("Digite sua idade:"));
    playedGames = 0;
    resetGame();
    gameStarted = true;
    updateScore();
    nextRound();
}

function nextRound() {
    if (score === maxScore) {
        endGame(true);
        return;
    }

    round++;
    addRandomColorToSequence();
    playSequence();
}

let soundOnHold = null; 

function handleButtonPress(color) {
    if (gameStarted) {
        highlightButton(color, 500);
        playerSequence.push(color);
        playSound(color);
        checkPlayerInput();
    }
}

function handleButtonHold(color) {
    if (gameStarted) {
        soundOnHold = new Audio(`sounds/${color}.mp3`);
        soundOnHold.loop = true; 
        soundOnHold.play();
    }
}

function handleButtonRelease() {
    if (soundOnHold) {
        soundOnHold.pause();
        soundOnHold.currentTime = 0;
    }
}

function checkPlayerInput() {
    const index = playerSequence.length - 1;
    if (playerSequence[index] !== sequence[index]) {
        playMixedSound();
        endGame(false);
    } else if (playerSequence.length === sequence.length) {
        score++;
        updateScore();
        playerSequence = [];
        disableButtons();
        setTimeout(() => {
            nextRound();
        }, 1000);
    }
}

function playMixedSound() {
    const mixedSound = new Audio();
    colors.forEach(color => {
        const sound = new Audio(`sounds/${color}.mp3`);
        mixedSound.volume = 0.5;
        mixedSound.add(sound);
    });
    mixedSound.play()
        .catch(error => {
            console.error('Erro ao reproduzir som misturado:', error);
        });
}

function playSequence() {
    disableButtons();
    let i = 0;

    function playNextColor() {
        const color = sequence[i];
        highlightButton(color, 1000);
        playSound(color);
        i++;

        if (i >= sequence.length) {
            setTimeout(() => {
                clearHighlights();
                enableButtons();
            }, 1000);
        } else {
            setTimeout(playNextColor, 1000);
        }
    }

    playNextColor();
}

function clearHighlights() {
    colors.forEach(color => {
        const button = document.getElementById(color);
        if (button) {
            button.classList.remove('active');
        }
    });
}

function highlightButton(color, duration) {
    const button = document.getElementById(color);
    if (button) {
        button.classList.add('active');
        setTimeout(() => {
            button.classList.remove('active');
        }, duration);
    }
}

function enableButtons() {
    colors.forEach(color => {
        document.getElementById(color).disabled = false;
    });
}

function disableButtons() {
    colors.forEach(color => {
        document.getElementById(color).disabled = true;
    });
}

function updateScore() {
    document.getElementById('score-value').innerText = score;
    document.getElementById('round-value').innerText = round;
}

function playSound(color) {
    const audio = new Audio(`sounds/${color}.mp3`);
    audio.play()
        .catch(error => {
            console.error(`Erro ao reproduzir som para a cor ${color}:`, error);
        });
}

function endGame(isWinner) {
    gameStarted = false;

    if (isWinner) {
        highlightAllColors(500);
        setTimeout(() => {
            alert(`Parabéns, ${playerName}! Você venceu com uma pontuação de ${score} em ${round} rodadas.`);
            resetGame();
        }, 500);
    } else {
        alert(`Game Over, ${playerName}! Sua pontuação final foi ${score} em ${round} rodadas.`);
        playedGames++;

        if (playedGames === 5) {
            downloadLog();
        }

        resetGame();
    }
}

function highlightAllColors(duration) {
    sequence.forEach((color, index) => {
        setTimeout(() => {
            highlightButton(color, duration);
        }, index * duration);
    });
}

function resetGame() {
    sequence = [];
    playerSequence = [];
    score = 0;
    round = 1;
    updateScore();
    gameStarted = false;
    enableButtons(); // Habilita os botões no reinício do jogo
    document.getElementById('start-button').innerText = 'Restart Game';
}

function restartGame() {
    resetGame();
    startGame();
}

function downloadLog() {
    const logContent = `Jogador: ${playerName}\nIdade: ${playerAge}\nPontuação final: ${score}\nRodadas: ${round}`;
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game_log.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
