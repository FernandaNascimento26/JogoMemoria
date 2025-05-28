document.addEventListener('DOMContentLoaded', () => {
  // Constantes do jogo
  const ROCK_BANDS = [
    { name: 'AC/DC', image: 'assets/ACDC.jpg' },
    { name: 'Led Zeppelin', image: 'assets/Led Zeppelin.jpeg' },
    { name: 'Rammstein', image: 'assets/Rammstein.jpeg' },
    { name: 'Rolling Stones', image: 'assets/Rolling Stones.jpg' },
    { name: 'Deep Purple', image: 'assets/Deep Purple.jpg' },
    { name: 'Megadeth', image: 'assets/Megadeth.jpeg' },
    { name: 'Scorpions', image: 'assets/Scorpions.jpg' },
    { name: 'Slayer', image: 'assets/Slayer.jpg' },
    { name: 'Iron Maiden', image: 'assets/Iron Maiden.jpeg' },
    { name: 'Pink Floyd', image: 'assets/Pink Floyd.jpeg' },
    { name: 'The Beatles', image: 'assets/The Beatles.jpeg' },
    { name: 'The Who', image: 'assets/The Who.jpeg' },
    { name: 'Metallica', image: 'assets/Metallica.jpeg' },
    { name: 'Black Sabbath', image: 'assets/Black Sabbath.jpg' },
    { name: 'Guns N Roses', image: 'assets/GuNRoses.jpeg' },
    { name: 'Nirvana', image: 'assets/Nirvana.jpg' },
    { name: 'Queen', image: 'assets/Queen.jpg' },
    { name: 'Judas Priest', image: 'assets/Judas Priest.jpeg' },
    { name: 'Kiss', image: 'assets/kiss.jpg' },
    { name: 'Ghost', image: 'assets/ghost.jpg' },
    { name: 'System of a Down', image: 'assets/System of a Down.jpeg' }
  ];

  const DIFFICULTIES = {
    easy: { rows: 4, cols: 4 },   // 8 pares
    medium: { rows: 4, cols: 6 }, // 12 pares
    hard: { rows: 6, cols: 6 }    // 18 pares
  };

  const SOUND_EFFECTS = {
    flip: new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3'),
    match: new Audio('https://www.soundjay.com/buttons/sounds/button-21.mp3'),
    win: new Audio('https://www.soundjay.com/buttons/sounds/button-20.mp3')
  };

  // Elementos do DOM
  const domElements = {
    buttonsContainer: document.getElementById('buttons-container'),
    gameContainer: document.getElementById('game-container'),
    memoryBoard: document.getElementById('memory-board'),
    movesDisplay: document.getElementById('moves'),
    pairsDisplay: document.getElementById('pairs'),
    totalPairsDisplay: document.getElementById('total-pairs'),
    messageContainer: document.getElementById('message'),
    messageText: document.querySelector('#message p'),
    restartButton: document.getElementById('restart'),
    bgMusic: document.getElementById('bgMusic'),
    toggleSound: document.getElementById('toggleSound')
  };

  // Estado do jogo
  const gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: 0,
    moves: 0,
    canFlip: true,
    isMusicPlaying: false,
    currentDifficulty: null
  };

  // Inicialização do jogo
  function initGame() {
    setupEventListeners();
  }

  // Configura os event listeners
  function setupEventListeners() {
    document.getElementById('easy').addEventListener('click', () => startGame('easy'));
    document.getElementById('medium').addEventListener('click', () => startGame('medium'));
    document.getElementById('hard').addEventListener('click', () => startGame('hard'));
    
    domElements.restartButton.addEventListener('click', resetGame);
    domElements.toggleSound.addEventListener('click', toggleMusic);
    domElements.messageContainer.addEventListener('click', () => hideMessage());
  }

  // Controle de música
  function toggleMusic() {
    if (gameState.isMusicPlaying) {
      domElements.bgMusic.pause();
      domElements.toggleSound.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
      domElements.bgMusic.play();
      domElements.toggleSound.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    gameState.isMusicPlaying = !gameState.isMusicPlaying;
  }

  // Inicia o jogo com a dificuldade selecionada
  function startGame(difficulty) {
    gameState.currentDifficulty = difficulty;
    const { rows, cols } = DIFFICULTIES[difficulty];
    gameState.totalPairs = (rows * cols) / 2;
    
    domElements.buttonsContainer.style.display = 'none';
    domElements.gameContainer.classList.remove('hide');
    domElements.totalPairsDisplay.textContent = gameState.totalPairs;
    
    setupBoard(rows, cols);
    
    if (!gameState.isMusicPlaying) {
      toggleMusic();
    }
  }

  // Prepara o tabuleiro
  function setupBoard(rows, cols) {
    resetGameState();
    domElements.memoryBoard.innerHTML = '';
    domElements.memoryBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    domElements.memoryBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    
    const selectedBands = [...ROCK_BANDS]
      .sort(() => 0.5 - Math.random())
      .slice(0, gameState.totalPairs);
    
    const cardsData = [...selectedBands, ...selectedBands]
      .sort(() => 0.5 - Math.random());
    
    cardsData.forEach((band, index) => {
      createCard(band, index);
    });
  }

  // Cria uma carta individual
  function createCard(band, index) {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.index = index;
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.innerHTML = '<i class="fas fa-question"></i>';
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    
    const img = document.createElement('img');
    img.src = band.image;
    img.alt = band.name;
    img.title = band.name;
    
    cardFront.appendChild(img);
    card.appendChild(cardBack);
    card.appendChild(cardFront);
    
    card.addEventListener('click', handleCardClick);
    domElements.memoryBoard.appendChild(card);
    
    gameState.cards.push({
      element: card,
      band: band.name,
      matched: false
    });
  }

  // Manipula o clique na carta
  function handleCardClick() {
    if (!gameState.canFlip || gameState.flippedCards.length >= 2) return;
    
    const cardIndex = parseInt(this.dataset.index);
    const card = gameState.cards[cardIndex];
    
    if (card.matched || gameState.flippedCards.includes(cardIndex)) return;
    
    flipCard(cardIndex);
    
    if (gameState.flippedCards.length === 2) {
      gameState.canFlip = false;
      gameState.moves++;
      updateScore();
      setTimeout(checkForMatch, 500);
    }
  }

  // Vira a carta
  function flipCard(cardIndex) {
    SOUND_EFFECTS.flip.currentTime = 0;
    SOUND_EFFECTS.flip.play();
    
    gameState.cards[cardIndex].element.classList.add('flipped');
    gameState.flippedCards.push(cardIndex);
  }

  // Verifica se as cartas viradas formam um par
  function checkForMatch() {
    const [firstIndex, secondIndex] = gameState.flippedCards;
    const firstCard = gameState.cards[firstIndex];
    const secondCard = gameState.cards[secondIndex];
    
    if (firstCard.band === secondCard.band) {
      handleMatch(firstCard, secondCard);
    } else {
      handleMismatch(firstIndex, secondIndex);
    }
  }

  // Manipula cartas que formam par
  function handleMatch(firstCard, secondCard) {
    SOUND_EFFECTS.match.play();
    
    firstCard.matched = true;
    secondCard.matched = true;
    gameState.matchedPairs++;
    
    firstCard.element.classList.add('highlight');
    secondCard.element.classList.add('highlight');
    
    gameState.flippedCards = [];
    gameState.canFlip = true;
    updateScore();
    
    if (gameState.matchedPairs === gameState.totalPairs) {
      handleGameWin();
    }
  }

  // Manipula cartas que não formam par
  function handleMismatch(firstIndex, secondIndex) {
    setTimeout(() => {
      gameState.cards[firstIndex].element.classList.remove('flipped');
      gameState.cards[secondIndex].element.classList.remove('flipped');
      gameState.flippedCards = [];
      gameState.canFlip = true;
    }, 1000);
  }

  // Manipula vitória no jogo
  function handleGameWin() {
    SOUND_EFFECTS.win.play();
    showMessage(`Você dominou em ${gameState.moves} jogadas!<br><span style="font-size:1.5rem">\m/ >_< \m/</span>`);
  }

  // Atualiza o placar
  function updateScore() {
    domElements.movesDisplay.textContent = gameState.moves;
    domElements.pairsDisplay.textContent = gameState.matchedPairs;
  }

  // Mostra mensagem
  function showMessage(msg) {
    domElements.messageText.innerHTML = msg;
    domElements.messageContainer.classList.remove('hide');
    
    // Esconde após 5 segundos ou quando clicar
    setTimeout(hideMessage, 5000);
  }

  // Esconde mensagem
  function hideMessage() {
    domElements.messageContainer.classList.add('hide');
  }

  // Reseta o estado do jogo
  function resetGameState() {
    gameState.cards = [];
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    gameState.moves = 0;
    gameState.canFlip = true;
    hideMessage();
    updateScore();
  }

  // Reinicia o jogo completamente
  function resetGame() {
    resetGameState();
    domElements.memoryBoard.innerHTML = '';
    domElements.gameContainer.classList.add('hide');
    domElements.buttonsContainer.style.display = 'block';
    
    // Se quiser reiniciar com a mesma dificuldade:
    // if (gameState.currentDifficulty) {
    //   setTimeout(() => startGame(gameState.currentDifficulty), 500);
    // }
  }

  // Inicia o jogo
  initGame();
});