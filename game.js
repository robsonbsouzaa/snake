// Configuração inicial do jogo
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("best-score");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart");

const gridSize = 20; // Tamanho de cada quadrado
const canvasSize = 400; // Tamanho da tela do jogo
let snake = [{ x: 160, y: 160 }]; // A cobra começa no meio da tela
let direction = "RIGHT"; // Direção inicial da cobra
let food = { x: 80, y: 80 }; // Posição da comida
let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0; // Carrega a melhor pontuação do localStorage
let gameInterval; // Intervalo do jogo
let gameSpeed = 100; // Velocidade inicial do jogo (em milissegundos)

bestScoreDisplay.innerText = bestScore;

// Função para iniciar o jogo
function startGame() {
    snake = [{ x: 160, y: 160 }];
    direction = "RIGHT";
    food = generateFood();
    score = 0;
    scoreDisplay.innerText = score;
    gameSpeed = 100; // Reseta a velocidade
    gameInterval = setInterval(gameLoop, gameSpeed);
    startButton.disabled = true; // Desabilita o botão de começar
}

// Função para atualizar a tela
function update() {
    // Move a cobra
    const head = { ...snake[0] };

    if (direction === "UP") head.y -= gridSize;
    if (direction === "DOWN") head.y += gridSize;
    if (direction === "LEFT") head.x -= gridSize;
    if (direction === "RIGHT") head.x += gridSize;

    snake.unshift(head); // Adiciona nova cabeça na cobra

    // Verifica se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score += 10; // Aumenta a pontuação
        food = generateFood(); // Gera nova comida
        // Aumenta a velocidade gradativamente conforme a pontuação
        if (score % 50 === 0) {
            gameSpeed -= 10; // Aumenta a velocidade (diminui o intervalo)
            clearInterval(gameInterval); // Limpa o intervalo atual
            gameInterval = setInterval(gameLoop, gameSpeed); // Reinicia o intervalo com a nova velocidade
        }
    } else {
        snake.pop(); // Remove a cauda da cobra
    }

    // Verifica se a cobra bateu nas bordas ou nela mesma
    if (
        head.x < 0 || head.x >= canvasSize || 
        head.y < 0 || head.y >= canvasSize || 
        isCollidingWithSelf()
    ) {
        resetGame(); // Reinicia o jogo se colidir
    }

    // Atualiza o placar
    scoreDisplay.innerText = score;

    // Atualiza o melhor placar
    if (score > bestScore) {
        bestScore = score;
        bestScoreDisplay.innerText = bestScore;
        localStorage.setItem("bestScore", bestScore); // Salva o melhor placar
    }

    draw(); // Desenha a cobra, a comida e a borda
}

// Função para desenhar a cobra, a comida e a borda do canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    // Desenha a borda do jogo (área limite)
    ctx.strokeStyle = "black"; // Cor da borda
    ctx.lineWidth = 5; // Largura da borda
    ctx.strokeRect(0, 0, canvas.width, canvas.height); // Desenha a borda ao redor do canvas

    // Desenha a cobra
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "blue" : "darkblue"; // Cabeça verde, corpo escuro
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Desenha a comida
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Função para gerar a comida em uma posição aleatória
function generateFood() {
    let foodX = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    let foodY = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    
    // Garante que a comida não apareça em cima da cobra
    while (snake.some(segment => segment.x === foodX && segment.y === foodY)) {
        foodX = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
        foodY = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    }

    return { x: foodX, y: foodY };
}

// Função para verificar se a cobra colidiu com ela mesma
function isCollidingWithSelf() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

// Função para reiniciar o jogo
function resetGame() {
    if (score > bestScore) {
        bestScore = score;
        bestScoreDisplay.innerText = bestScore;
        localStorage.setItem("bestScore", bestScore);
    }
    clearInterval(gameInterval); // Para o intervalo atual
    startButton.disabled = false; // Reabilita o botão de começar
    startButton.innerText = "Começar Jogo"; // Reseta o texto do botão
    score = 0;
    scoreDisplay.innerText = score;
}

// Função para mudar a direção da cobra
function changeDirection(event) {
    const key = event.keyCode;

    if (key === 37 && direction !== "RIGHT") direction = "LEFT";
    if (key === 38 && direction !== "DOWN") direction = "UP";
    if (key === 39 && direction !== "LEFT") direction = "RIGHT";
    if (key === 40 && direction !== "UP") direction = "DOWN";
}

// Evento para detectar a mudança de direção
document.addEventListener("keydown", changeDirection);

// Função do loop do jogo
function gameLoop() {
    update();
}

// Função para reiniciar o jogo ao clicar no botão
restartButton.addEventListener("click", resetGame);

// Inicia o jogo ao clicar no botão "Começar Jogo"
startButton.addEventListener("click", startGame);
