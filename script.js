const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 定义方块大小
const blockSize = 20;
// 蛇的初始位置和方向
let snake = [
  { x: 10, y: 10 }
];
let direction = 'right';
// 食物的初始位置
let food = {
  x: Math.floor(Math.random() * (canvas.width / blockSize)),
  y: Math.floor(Math.random() * (canvas.height / blockSize))
};
// 新增：是否为特殊食物
let isSpecialFood = false;
// 新增：积分
let score = 0;
// 获取得分显示元素
const scoreElement = document.getElementById('score');
// 新增：历史最高分，从本地存储获取，如果没有则初始化为 0
let highScore = localStorage.getItem('snakeHighScore') || 0;
// 获取历史最高分显示元素
const highScoreElement = document.getElementById('high-score');
// 新增：游戏是否暂停
let isPaused = false;
// 新增：游戏循环定时器
let gameInterval;
// 新增：正常速度和加速后的速度
const normalSpeed = 200;
let currentSpeed = normalSpeed;

// 绘制蛇
function drawSnake() {
  ctx.fillStyle = 'green';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
  });
}

// 绘制食物
function drawFood() {
  ctx.fillStyle = isSpecialFood ? 'yellow' : 'red';
  ctx.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize);
}

// 移动蛇
function moveSnake() {
  if (isPaused) return;

  let head = { ...snake[0] };
  switch (direction) {
    case 'right':
      head.x++;
      break;
    case 'left':
      head.x--;
      break;
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
  }
  snake.unshift(head);

  // 检查是否吃到食物
  if (head.x === food.x && head.y === food.y) {
    if (isSpecialFood) {
      // 吃到特殊食物，加速
      currentSpeed = normalSpeed / 2;
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, currentSpeed);
    } else {
      // 吃到普通食物，恢复正常速度
      currentSpeed = normalSpeed;
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, currentSpeed);
    }
    // 生成新的食物
    generateFood();
    // 增加积分
    score++;
    // 更新得分显示
    scoreElement.textContent = score;
    // 更新历史最高分
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('snakeHighScore', highScore);
      // 更新历史最高分显示
      highScoreElement.textContent = highScore;
    }
  } else {
    // 移除蛇的尾部
    snake.pop();
  }
}

// 生成新的食物
function generateFood() {
  // 随机决定是否为特殊食物
  isSpecialFood = Math.random() < 0.2; 
  food = {
    x: Math.floor(Math.random() * (canvas.width / blockSize)),
    y: Math.floor(Math.random() * (canvas.height / blockSize))
  };
}

// 检查游戏是否结束
function checkGameOver() {
  let head = snake[0];
  // 检查是否撞到墙壁
  if (head.x < 0 || head.x >= canvas.width / blockSize || head.y < 0 || head.y >= canvas.height / blockSize) {
    return true;
  }
  // 检查是否撞到自己
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

// 游戏主循环
function gameLoop() {
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 移动蛇
  moveSnake();
  // 绘制蛇和食物
  drawSnake();
  drawFood();
  // 检查游戏是否结束
  if (checkGameOver()) {
    alert('游戏结束！');
    // 重置游戏
    resetGame();
    return;
  }
}

// 重置游戏
function resetGame() {
  snake = [
    { x: 10, y: 10 }
  ];
  direction = 'right';
  score = 0;
  // 重置得分显示
  scoreElement.textContent = score;
  currentSpeed = normalSpeed;
  clearInterval(gameInterval);
  generateFood();
  gameInterval = setInterval(gameLoop, currentSpeed);
}

// 监听键盘事件
document.addEventListener('keydown', function (event) {
  switch (event.key) {
    case 'ArrowRight':
      if (direction!== 'left') direction = 'right';
      break;
    case 'ArrowLeft':
      if (direction!== 'right') direction = 'left';
      break;
    case 'ArrowUp':
      if (direction!== 'down') direction = 'up';
      break;
    case 'ArrowDown':
      if (direction!== 'up') direction = 'down';
      break;
    case 'Space':
      // 暂停/继续游戏
      isPaused =!isPaused;
      if (isPaused) {
        clearInterval(gameInterval);
      } else {
        gameInterval = setInterval(gameLoop, currentSpeed);
      }
      break;
  }
});

// 初始化得分和历史最高分显示
scoreElement.textContent = score;
highScoreElement.textContent = highScore;

// 开始游戏
gameInterval = setInterval(gameLoop, currentSpeed);